import pandas as pd
import numpy as np
import random

# 1. Kitna data chahiye? (1000 students)
num_students = 1000

data = []

for i in range(num_students):
    # Randomly generate factors for each student
    attendance = random.randint(40, 100)           # 40% se 100% ke beech
    cgpa = round(random.uniform(4.0, 10.0), 2)     # 4.0 se 10.0 ke beech
    backlogs = random.randint(0, 8)                # 0 se 8 backlogs
    assignments = random.randint(20, 100)          # 20% se 100% completion
    fees_paid = random.choice([0, 1])              # 0 = No, 1 = Yes

    # --- Realistic Logic for 'Dropout' Label ---
    # ML model ko pattern seekhane ke liye hum thoda logic khud dalenge
    # Agar attendance kam hai, backlogs zyada hain aur cgpa low hai -> Dropout chances high
    risk_score = (100 - attendance) * 0.3 + (10 - cgpa) * 3 + (backlogs * 10) + (100 - assignments) * 0.1
    
    if fees_paid == 0:
        risk_score += 20 # Fees na bharna ek bada risk hai

    # Agar risk_score 60 se upar hai, toh Dropout hone ke chances 1 (Yes) hain
    # Thoda randomness add kiya taaki model thoda struggle kare aur real lage
    if risk_score > 65:
        dropout = 1
    else:
        dropout = 0

    data.append([attendance, cgpa, backlogs, assignments, fees_paid, dropout])

# 2. Create a DataFrame (Table format)
columns = ['attendance', 'cgpa', 'backlogs', 'assignments', 'fees_paid', 'dropout']
df = pd.DataFrame(data, columns=columns)

# 3. Save as CSV file
df.to_csv('student_data.csv', index=False)

print("✅ Success: 1000 student records generated in 'student_data.csv'!")