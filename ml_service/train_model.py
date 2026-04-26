import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

# 1. Data load karo
df = pd.read_csv('student_data.csv')

# 2. Features (Inputs) aur Label (Output) ko alag karo
# X = Sab kuch siwaye 'dropout' ke
# y = Sirf 'dropout' column
X = df.drop('dropout', axis=1)
y = df['dropout']

# 3. Data ko split karo: Training (80%) aur Testing (20%)
# Hum 800 baccho ka data model ko seekhne ke liye denge
# Aur baaki 200 baccho se uska test lenge ki woh sahi predict kar raha hai ya nahi
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)



# 4. Model (The Brain) ko initialize aur train karo
model = RandomForestClassifier(n_estimators=100) # 100 decision trees ka forest
model.fit(X_train, y_train)

# 5. Check karo kitna hoshiyar hai hamara model (Accuracy)
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"🎯 Model Accuracy: {accuracy * 100:.2f}%")

# 6. Brain ko save karo (Pickle file)
# Yeh file hamara main product hai jise hum Node.js ke saath use karenge
with open('dropout_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Success: 'dropout_model.pkl' has been generated!")