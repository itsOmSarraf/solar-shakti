# Let's create a realistic dataset for one year of hourly data
import datetime
import random
import math

def generate_solar_data():
    data = []
    start_date = datetime.datetime(2023, 1, 1)
    end_date = datetime.datetime(2023, 12, 31)

    # Helper function to format date
    def format_date(date):
        return date.isoformat()[:19].replace('T', ' ')

    # Helper function to generate realistic solar irradiance based on hour and month
    def get_solar_irradiance(hour, month):
        if hour < 6 or hour > 18:
            return 0
        max_irradiance = [500, 600, 750, 850, 950, 1000, 1000, 950, 850, 700, 550, 450][month - 1]
        hour_factor = math.sin((math.pi * (hour - 6)) / 12)
        return round(max_irradiance * hour_factor)

    # Generate data for each hour
    delta = datetime.timedelta(hours=1)
    while start_date <= end_date:
        hour = start_date.hour
        month = start_date.month
        day_of_week = start_date.weekday()
        is_weekend = day_of_week in [5, 6]  # Saturday and Sunday

        # Generate realistic values with some randomness
        base_temp = [20, 22, 25, 28, 32, 35, 34, 33, 31, 28, 24, 21][month - 1]
        temp = base_temp + ((hour < 12) * (hour + 24 - hour) * 0.5 + (random.random() - 0.5) * 3)

        cloud_cover = min(100, max(0, round(random.random() * 100)))
        solar_irr = get_solar_irradiance(hour, month - 1) * (1 - cloud_cover / 200)

        base_consumption = 2.5 if is_weekend else 3.0
        consumption = base_consumption + (1.5 if (hour >= 18 or (hour >= 7 and hour <= 9)) else 0) + random.random()

        # Calculate solar generation based on irradiance and conditions
        solar_gen = (hour >= 6 and hour <= 18) * solar_irr * 0.001 * (1 - cloud_cover / 200) * (1 - abs(temp - 25) * 0.004)

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
            'electricity_rate': 12.5 if (hour >= 18 and hour <= 22) else 8.5
        })

        start_date += delta

    # Convert to CSV
    headers = list(data[0].keys())
    csv = [','.join(headers)] + [','.join([str(row[key]) for key in headers]) for row in data]

    # Write to a new CSV file
    with open('solar_data.csv', 'w') as file:
        file.write('\n'.join(csv))

    print('\nTotal records generated:', len(data))

generate_solar_data()
