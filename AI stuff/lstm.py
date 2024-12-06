import pandas as pd
import numpy as np
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

def prepare_data(df, target_col='solar_generation', sequence_length=24):
    """
    Prepare time series data for LSTM model.
    
    Parameters:
    df: DataFrame containing the time series data
    target_col: Column name for the target variable
    sequence_length: Number of time steps to look back
    """
    # Convert timestamp to datetime if it isn't already
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Create features for the model
    features = ['hour', 'temperature', 'cloud_cover', 'solar_irradiance', 
               'humidity', 'wind_speed', 'panel_temp']
    
    # Scale the features
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(df[features])
    scaled_target = scaler.fit_transform(df[[target_col]])
    
    X, y = [], []
    for i in range(len(df) - sequence_length):
        X.append(scaled_features[i:(i + sequence_length)])
        y.append(scaled_target[i + sequence_length])
    
    return np.array(X), np.array(y), scaler

def create_lstm_model(input_shape):
    """
    Create an LSTM model for solar generation prediction.
    """
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1)
    ])
    
    # Use proper loss function specification
    model.compile(optimizer='adam',
                 loss=tf.keras.losses.MeanSquaredError(),
                 metrics=[tf.keras.metrics.MeanAbsoluteError()])
    
    return model

def main():
    # Read the data
    df = pd.read_csv('solar_data.csv')
    
    # Prepare the data
    X, y, scaler = prepare_data(df)
    
    # Split into train and test sets
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]
    
    # Create and train the model
    model = create_lstm_model(input_shape=(X.shape[1], X.shape[2]))
    
    # Add early stopping to prevent overfitting
    early_stopping = keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True
    )
    
    # Train the model
    history = model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=32,
        validation_split=0.2,
        callbacks=[early_stopping],
        verbose=1
    )
    
    # Save the model properly
    model.save('model.h5', save_format='h5')

if __name__ == "__main__":
    main()