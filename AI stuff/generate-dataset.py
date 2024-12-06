# Let's create a realistic dataset for five years of hourly data
import datetime
import random
import math
import pandas as pd
from sklearn.metrics import f1_score, mean_squared_error, mean_absolute_error, r2_score

def generate_solar_data():
    data = []
    # Modified to start from 2019
    start_date = datetime.datetime(2019, 1, 1)
    # Modified to end in 2023
    end_date = datetime.datetime(2023, 12, 31)

    # Helper function to format date
    def format_date(date):
        return date.isoformat()[:19].replace('T', ' ')

    # Helper function to generate realistic solar irradiance based on hour and month
    def get_solar_irradiance(hour, month, year):
        if hour < 6 or hour > 18:
            return 0
        # Base irradiance patterns for each month
        max_irradiance = [500, 600, 750, 850, 950, 1000, 1000, 950, 850, 700, 550, 450][month - 1]
        # Add slight year-over-year variation to simulate changing weather patterns
        yearly_factor = 1 + (year - 2019) * 0.01
        hour_factor = math.sin((math.pi * (hour - 6)) / 12)
        return round(max_irradiance * hour_factor * yearly_factor)

    # Generate data for each hour
    delta = datetime.timedelta(hours=1)
    while start_date <= end_date:
        hour = start_date.hour
        month = start_date.month
        year = start_date.year
        day_of_week = start_date.weekday()
        is_weekend = day_of_week in [5, 6]  # Saturday and Sunday

        # Generate realistic values with some randomness and yearly trends
        base_temp = [20, 22, 25, 28, 32, 35, 34, 33, 31, 28, 24, 21][month - 1]
        # Add slight temperature increase each year to simulate climate trends
        yearly_temp_increase = (year - 2019) * 0.1
        temp = base_temp + yearly_temp_increase + ((hour < 12) * (hour + 24 - hour) * 0.5 + (random.random() - 0.5) * 3)

        cloud_cover = min(100, max(0, round(random.random() * 100)))
        solar_irr = get_solar_irradiance(hour, month, year) * (1 - cloud_cover / 200)

        # Simulate gradual increase in consumption over years
        yearly_consumption_increase = 1 + (year - 2019) * 0.03
        base_consumption = (2.5 if is_weekend else 3.0) * yearly_consumption_increase
        consumption = base_consumption + (1.5 if (hour >= 18 or (hour >= 7 and hour <= 9)) else 0) + random.random()

        # Calculate solar generation with improving efficiency over years
        efficiency_improvement = 1 + (year - 2019) * 0.02
        solar_gen = (hour >= 6 and hour <= 18) * solar_irr * 0.001 * (1 - cloud_cover / 200) * (1 - abs(temp - 25) * 0.004) * efficiency_improvement

        # Simulate gradually increasing electricity rates
        base_peak_rate = 12.5 + (year - 2019) * 0.5
        base_off_peak_rate = 8.5 + (year - 2019) * 0.3

        data.append({
            'timestamp': format_date(start_date),
            'hour': hour,
            'day_of_week': day_of_week,
            'month': month,
            'is_weekend': is_weekend,
            'is_holiday': 0,
            'temperature': round(temp, 1),
            'cloud_cover': cloud_cover,
            'solar_irradiance': round(solar_irr),
            'humidity': round(60 + random.random() * 30),
            'precipitation_prob': round(random.random() * 100),
            'wind_speed': round(5 + random.random() * 20),
            'solar_generation': round(solar_gen, 2),
            'panel_temp': round(temp + (solar_irr > 0) * 10, 1),
            'system_efficiency': round(90 - random.random() * 5),
            'battery_level': round(60 + random.random() * 40),
            'consumption': round(consumption, 2),
            'grid_ie': round(solar_gen - consumption, 2),
            'peak_flag': 1 if (hour >= 18 and hour <= 22) else 0,
            'electricity_rate': base_peak_rate if (hour >= 18 and hour <= 22) else base_off_peak_rate
        })

        start_date += delta

    # Convert to CSV
    headers = list(data[0].keys())
    csv = [','.join(headers)] + [','.join([str(row[key]) for key in headers]) for row in data]

    # Write to a new CSV file
    with open('solar_data.csv', 'w') as file:
        file.write('\n'.join(csv))

    total_records = len(data)
    print('\nTotal records generated:', total_records)
    print('Years of data:', 5)
    print('Hours per year:', total_records // 5)
    print('Total features per record:', len(headers))
    print('Total data points:', total_records * len(headers))

    # Load the generated data into a DataFrame for analysis
    df = pd.read_csv('solar_data.csv')

    # Calculate correlations
    correlations = df.corr()
    print('\nCorrelations:')
    print(correlations)

    # Calculate metrics for a simple model (assuming a simple model is trained)
    # Assuming 'solar_generation' as the target variable
    # For demonstration, let's assume we have a simple model that predicts 'solar_generation' with some error
    # This is a placeholder for actual model evaluation
    predicted_solar_gen = df['solar_generation'] + random.random() * 10  # Simulate predictions with some error
    df['predicted_solar_gen'] = predicted_solar_gen

    # Calculate metrics
    mse = mean_squared_error(df['solar_generation'], df['predicted_solar_gen'])
    mae = mean_absolute_error(df['solar_generation'], df['predicted_solar_gen'])
    r2 = r2_score(df['solar_generation'], df['predicted_solar_gen'])
    f1 = f1_score(df['solar_generation'], df['predicted_solar_gen'], average='macro')

    print('\nModel Evaluation Metrics:')
    print(f'Mean Squared Error (MSE): {mse}')
    print(f'Mean Absolute Error (MAE): {mae}')
    print(f'R-Squared (R2): {r2}')
    print(f'F1 Score: {f1}')

generate_solar_data()