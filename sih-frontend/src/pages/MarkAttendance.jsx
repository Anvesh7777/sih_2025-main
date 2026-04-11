import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Camera, ShieldCheck, AlertCircle, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

function MarkAttendance() {
  const [status, setStatus] = useState({ type: 'idle', msg: '' });
  const [isScannerActive, setIsScannerActive] = useState(false);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null); // Ref for the hidden file input
  const navigate = useNavigate();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // --- CAMERA SCAN LOGIC ---
  const startScanner = async () => {
    setStatus({ type: 'loading', msg: 'Initializing Camera...' });
    setIsScannerActive(true);
    const html5QrCode = new Html5Qrcode("stable-reader");
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          await html5QrCode.stop();
          handleAttendance(decodedText);
        },
        () => {}
      );
      setStatus({ type: 'scanning', msg: 'Align QR Code in the frame' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Camera failed or denied.' });
      setIsScannerActive(false);
    }
  };

  // --- FILE UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus({ type: 'loading', msg: 'Processing image...' });
    
    // We create a temporary scanner instance just to scan the file
    const html5QrCode = new Html5Qrcode("stable-reader");
    
    try {
      const decodedText = await html5QrCode.scanFileV2(file, true);
      handleAttendance(decodedText.decodedText);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'No valid QR code found in this image.' });
    }
  };

  const handleAttendance = async (qrToken) => {
    setStatus({ type: 'loading', msg: 'Verifying protocol...' });
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ qrToken })
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: data.message || "Attendance Confirmed" });
        setTimeout(() => navigate('/dashboard/attendance'), 2000);
      } else {
        setStatus({ type: 'error', msg: data.message });
        setIsScannerActive(false); 
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Connection failed' });
      setIsScannerActive(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 animate-in fade-in duration-700">
      <div className="bg-[#0f172a] border border-white/10 rounded-[40px] p-8 shadow-2xl">
        
        <header className="text-center mb-8">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Identity Check</h1>
            <p className="text-slate-500 text-xs font-bold mt-1">PROTOTYPE MODE: CAMERA + UPLOAD</p>
        </header>

        <div className={`relative rounded-3xl overflow-hidden border-2 transition-all ${isScannerActive ? 'border-emerald-500/50' : 'border-slate-800'}`}>
          <div 
            id="stable-reader" 
            className={`${!isScannerActive ? 'hidden' : 'block'}`}
            style={{ width: '100%', minHeight: '300px', backgroundColor: '#000' }}
          ></div>

          {!isScannerActive && (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 bg-slate-900/50 p-6">
              
              {/* Option 1: Live Camera */}
              <button 
                onClick={startScanner}
                className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-black py-4 rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
              >
                <Camera size={20} /> LIVE SCANNER
              </button>

              <div className="flex items-center gap-4 w-full my-2">
                <div className="h-[1px] bg-white/10 flex-grow"></div>
                <span className="text-[10px] font-black text-slate-600 tracking-widest">OR</span>
                <div className="h-[1px] bg-white/10 flex-grow"></div>
              </div>

              {/* Option 2: Upload File */}
              <button 
                onClick={() => fileInputRef.current.click()}
                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95"
              >
                <Upload size={20} /> UPLOAD QR IMAGE
              </button>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              <p className="text-[10px] text-slate-500 font-medium text-center px-4 leading-relaxed">
                If your webcam is blurry, take a clear photo of the QR and upload it here.
              </p>
            </div>
          )}
        </div>

        {/* Status Display */}
        <div className={`mt-8 p-4 rounded-2xl flex items-center justify-center gap-3 border transition-all ${
          status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          status.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
          'bg-slate-800/50 border-white/5 text-slate-500'
        }`}>
          {status.type === 'loading' && <Loader2 className="animate-spin" size={18} />}
          {status.type === 'success' && <ShieldCheck size={18} />}
          <span className="font-bold text-[10px] uppercase tracking-[0.2em]">
            {status.msg || 'System Standing By'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;