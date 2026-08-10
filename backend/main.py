
destination = input("Enter your destination: ")
country = input("Enter the country: ")
days = int(input("Enter number of days: "))
budget = float(input("Enter your budget: "))
currency = input("Enter the currency: ")
travel_style = input("Enter your travel style: ")
hotel = float(input("Enter estimated hotel cost: "))
food = float(input("Enter estimated food cost: "))
transportation = float(input("Enter estimated transportation cost: "))
miscs = float(input("Enter estimated miscellaneous cost: "))
travel_month = input("Enter the travel month: ")


def estimated_cost(hotel, food, transportation, miscs):
    return hotel+food+transportation+miscs

def print_trip_summary(destination, days, budget, travel_style, hotel,food, transportation, miscs, country, currency, travel_month):
    print("===============================================================\n")
    print("Trip Summary")
    print("===============================================================\n")
    print(f"Destination             : {destination}")
    print(f"country                 : {country}")
    print(f"Days                    : {days}")
    print(f"Budget                  : {budget:.2f} {currency}")
    print(f"Travel Style            : {travel_style}")
    print(f"Travel Months           : {travel_month}")
    total_cost = estimated_cost(hotel, food, transportation, miscs)
    if (total_cost > budget):
        print(f"⚠️ exceeded budget")
    else:
        print(f"Total Estimated Cost    : {total_cost:.2f} {currency}")


print_trip_summary(destination, days, budget, travel_style, hotel, food, transportation, miscs, country, currency, travel_month)