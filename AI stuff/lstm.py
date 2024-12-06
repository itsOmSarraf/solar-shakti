import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Step 1: Load and preprocess the data
def load_and_preprocess_data(file_path, sequence_length=24):
    """
    Load data and prepare it for LSTM model.
    sequence_length: Number of time steps to look back (24 hours in this case)
    """
    # Read the CSV file
    df = pd.read_csv(file_path)
    
    # Convert timestamp to datetime and set as index
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)

    # Select features for prediction
    features = ['hour', 'day_of_week', 'month', 'is_weekend', 
               'temperature', 'cloud_cover', 'solar_irradiance',
               'humidity', 'solar_generation', 'consumption']

    # Normalize the data
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df[features])
    
    # Create sequences for LSTM
    X, y = [], []
    for i in range(len(scaled_data) - sequence_length):
        X.append(scaled_data[i:(i + sequence_length)])
        # Predict next hour's solar generation (feature index 8)
        y.append(scaled_data[i + sequence_length, 8])
    
    return np.array(X), np.array(y), scaler, features

# Step 2: Build the LSTM model
def create_lstm_model(sequence_length, n_features):
    """
    Create a stacked LSTM model with dropout layers to prevent overfitting
    """
    model = Sequential([
        # First LSTM layer with return sequences for stacking
        LSTM(64, activation='relu', return_sequences=True, 
             input_shape=(sequence_length, n_features)),
        Dropout(0.2),
        
        # Second LSTM layer
        LSTM(32, activation='relu'),
        Dropout(0.2),
        
        # Dense layers for final prediction
        Dense(16, activation='relu'),
        Dense(1)  # Output layer for solar generation prediction
    ])
    
    # Compile model with mean squared error loss and Adam optimizer
    model.compile(optimizer=Adam(learning_rate=0.001),
                 loss='mse',
                 metrics=['mae'])
    
    return model

# Step 3: Train and evaluate the model

    """
    Train the model and evaluate its performance. Optionally, save the model.
    """
    # Split data into training and testing sets (80-20 split)
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]
    
    # Create and train the model
    model = create_lstm_model(X.shape[1], X.shape[2])
    
    # Train with early stopping to prevent overfitting
    history = model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=32,
        validation_split=0.2,
        verbose=1
    )
    
    # Evaluate model on test data
    y_pred = model.predict(X_test)
    y_pred_unscaled = scaler.inverse_transform(y_pred)
    y_test_unscaled = scaler.inverse_transform(y_test.reshape(-1, 1))
    
    # Calculate evaluation metrics
    mse = np.mean((y_pred_unscaled - y_test_unscaled) ** 2)
    mae = np.mean(np.abs(y_pred_unscaled - y_test_unscaled))
    accuracy = accuracy_score(y_test_unscaled, y_pred_unscaled)
    precision = precision_score(y_test_unscaled, y_pred_unscaled, average='weighted')
    recall = recall_score(y_test_unscaled, y_pred_unscaled, average='weighted')
    f1 = f1_score(y_test_unscaled, y_pred_unscaled, average='weighted')
    
    # Optionally save the model
    if model_path:
        model.save(model_path)
    
    return model, history, (X_test, y_test), mse, mae, accuracy, precision, recall, f1

def train_evaluate_model(X, y, scaler, model_path='model.h5'):
    """
    Train the model and evaluate its performance. Optionally, save the model.
    """
    # Split data into training and testing sets (80-20 split)
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]
    
    # Create and train the model
    model = create_lstm_model(X.shape[1], X.shape[2])
    
    # Train with early stopping to prevent overfitting
    history = model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=32,
        validation_split=0.2,
        verbose=1
    )
    
    # Evaluate model on test data
    y_pred = model.predict(X_test)
    
    # Create dummy arrays for inverse transform
    dummy_pred = np.zeros((len(y_pred), 10))  # 10 is the number of features
    dummy_pred[:, 8] = y_pred.flatten()  # 8 is solar_generation index
    
    dummy_test = np.zeros((len(y_test), 10))
    dummy_test[:, 8] = y_test
    
    # Inverse transform
    y_pred_unscaled = scaler.inverse_transform(dummy_pred)[:, 8]
    y_test_unscaled = scaler.inverse_transform(dummy_test)[:, 8]
    
    # Calculate metrics
    mse = np.mean((y_pred_unscaled - y_test_unscaled) ** 2)
    mae = np.mean(np.abs(y_pred_unscaled - y_test_unscaled))
    
    # For classification metrics, we need to discretize the values
    # Let's consider prediction within 10% of actual as correct
    threshold = 0.1
    y_pred_class = np.abs(y_pred_unscaled - y_test_unscaled) <= (threshold * y_test_unscaled)
    y_test_class = np.ones_like(y_test_unscaled, dtype=bool)
    
    accuracy = accuracy_score(y_test_class, y_pred_class)
    precision = precision_score(y_test_class, y_pred_class, zero_division=1)
    recall = recall_score(y_test_class, y_pred_class, zero_division=1)
    f1 = f1_score(y_test_class, y_pred_class, zero_division=1)
    
    # Save the model
    if model_path:
        model.save(model_path)
    
    return model, history, (X_test, y_test), mse, mae, accuracy, precision, recall, f1

# And update the main function:
def main():
    # Load and preprocess data
    X, y, scaler, features = load_and_preprocess_data('solar_data.csv')
    
    # Train and evaluate model
    model, history, (X_test, y_test), mse, mae, accuracy, precision, recall, f1 = train_evaluate_model(X, y, scaler)
    
    # Visualize results
    predictions, actuals = visualize_predictions(model, X_test, y_test, scaler, features)
    
    # Print model performance metrics
    print(f'\nModel Performance Metrics:')
    print(f'Mean Squared Error: {mse:.4f}')
    print(f'Mean Absolute Error: {mae:.4f}')
    print(f'Accuracy: {accuracy:.4f}')
    print(f'Precision: {precision:.4f}')
    print(f'Recall: {recall:.4f}')
    print(f'F1 Score: {f1:.4f}')
# Step 4: Make predictions and visualize results
def visualize_predictions(model, X_test, y_test, scaler, features):
    """
    Make predictions and create visualization
    """
    # Make predictions
    predictions = model.predict(X_test)
    
    # Inverse transform the predictions and actual values
    # Create dummy array with same shape as feature set
    dummy = np.zeros((len(predictions), len(features)))
    dummy[:, 8] = predictions.flatten()  # 8 is the index of solar_generation
    predictions_unscaled = scaler.inverse_transform(dummy)[:, 8]
    
    dummy[:, 8] = y_test
    actual_unscaled = scaler.inverse_transform(dummy)[:, 8]
    
    # Plot results
    plt.figure(figsize=(12, 6))
    plt.plot(actual_unscaled, label='Actual')
    plt.plot(predictions_unscaled, label='Predicted')
    plt.title('Solar Generation: Actual vs Predicted')
    plt.xlabel('Time')
    plt.ylabel('Solar Generation (kW)')
    plt.legend()
    plt.show()
    
    return predictions_unscaled, actual_unscaled

# Main execution
def main():
    # Load and preprocess data
    X, y, scaler, features = load_and_preprocess_data('solar_data.csv')
    
    # Load the model if it exists, otherwise train and save
    try:
        model = load_model('model.h5')
    except FileNotFoundError:
        model, history, (X_test, y_test), mse, mae, accuracy, precision, recall, f1 = train_evaluate_model(X, y, scaler)
    
    # Visualize results
    predictions, actuals = visualize_predictions(model, X_test, y_test, scaler, features)
    
    # Print model performance metrics
    print(f'\nModel Performance Metrics:')
    print(f'Mean Squared Error: {mse:.4f}')
    print(f'Mean Absolute Error: {mae:.4f}')
    print(f'Accuracy: {accuracy:.4f}')
    print(f'Precision: {precision:.4f}')
    print(f'Recall: {recall:.4f}')
    print(f'F1 Score: {f1:.4f}')

if __name__ == "__main__":
    main()