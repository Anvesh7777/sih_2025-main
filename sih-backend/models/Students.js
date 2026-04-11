const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    // --- BASIC INFORMATION ---
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    enrollmentNumber: { 
        type: String, 
        required: [true, 'Enrollment number is required'], 
        unique: true,
        uppercase: true 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: 6 
    },
    branch: { 
        type: String, 
        required: [true, 'Branch is required'],
        enum: ['Information technology', 'Computer Science', 'Electronics', 'Mechanical', 'Civil'] // Adjust based on your college
    },
    role: { 
        type: String, 
        enum: ['student', 'admin'], 
        default: 'student' 
    },

    // --- ML FEATURES & PERFORMANCE TRACKING ---
    cgpa: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 10 
    },
    attendancePercentage: { 
        type: Number, 
        default: 100, 
        min: 0, 
        max: 100 
    },
    classesAttended: { 
        type: Number, 
        default: 0 
    },
    totalClassesHeld: { 
        type: Number, 
        default: 0 
    },
    feesPaid: { 
        type: Boolean, 
        default: true 
    },
    assignmentsCompleted: { 
        type: Number, 
        default: 0 
    },
    totalAssignments: { 
        type: Number, 
        default: 0 
    },

    // --- ANALYTICS ---
    riskScore: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 100 
    },
    lastRiskUpdate: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true // Automatically creates createdAt and updatedAt
});

/**
 * @desc Password hashing middleware
 */
studentSchema.pre('save', async function (next) { 
    if (!this.isModified('password')) { 
        next(); 
    } 
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
});

/**
 * @desc Method to compare entered password with hashed password
 */
studentSchema.methods.matchPassword = async function (enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password); 
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;