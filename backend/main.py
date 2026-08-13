from services.trip_service import calculate_daily_budget,get_trip_category, print_recommended_places, print_transportation_recommendation


destinations =[]
while True:
    destination = input("Enter your destination (or leave empty to finish): ")
    if not destination:
        break

    destinations.append(destination)

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

def print_trip_summary(destinations, days, budget, travel_style, hotel,food, transportation, miscs, country, currency, travel_month):
    

    daily = calculate_daily_budget(1500, 5)
    category = get_trip_category(1500)
    total_cost = estimated_cost(hotel, food, transportation, miscs)
    allDestinations = ""
    for destination in destinations:
        allDestinations+= destination + ", "
    allDestinations = allDestinations[:-2]  # Remove the trailing comma and space
    print("===============================================================\n")
    print("Trip Summary")
    print("===============================================================\n")
    print(f"Destination             : {allDestinations}")
    print(f"country                 : {country}")
    print(f"Days                    : {days}")
    print(f"Budget                  : {budget:.2f} {currency}")
    print(f"Travel Style            : {travel_style}")
    print(f"Category                : {category}")
    print(f"Travel Months           : {travel_month}")
    print(f"Total Estimated Cost    : {total_cost:.2f} {currency}")
    print(f"Daily Budget            : {daily} {currency}/day")
    if (total_cost > budget):
        print(f"⚠️ exceeded budget")
    print_recommended_places()
    print_transportation_recommendation(category)

print_trip_summary(destinations, days, budget, travel_style, hotel, food, transportation, miscs, country, currency, travel_month)