import pandas as pd

# Function to extract phone numbers from a specific range of rows in an Excel file
def extract_phone_numbers(input_file, output_file, start_row, end_row):
    try:
        # Load the Excel file
        data = pd.read_excel(input_file)

        # Check if the 'Phone' column exists
        if 'Phone' not in data.columns:
            print("Error: 'Phone' column not found in the Excel file.")
            return

        # Extract the specified range of rows from the 'Phone' column
        phone_numbers = data['Phone'].iloc[start_row:end_row]

        # Save the phone numbers to a new file
        phone_numbers.to_csv(output_file, index=False, header=True)

        print(f"Successfully extracted phone numbers from row {start_row + 1} to {end_row} to {output_file}.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Input and output file paths
input_excel_file =r"D:\database\lot3\Industrial Supplies 1.38L.xlsx"  # Replace with your input file path
output_csv_file = 'phone_numbers.csv'  # Replace with your desired output file path

# Specify the range of rows (0-indexed)
start_row = 5000  # Starting row (inclusive)
end_row = 10000   # Ending row (exclusive)

# Call the function
extract_phone_numbers(input_excel_file, output_csv_file, start_row, end_row)