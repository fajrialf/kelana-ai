
def estimated_cost(hotel, food, transportation, miscs):
    return hotel+food+transportation+miscs

def trip_summary(destination, days, budget, travel_style, hotel,food, transportation, miscs):
    print("=============================\n")
    print("Trip Summary")
    print("=============================\n")
    print(f"Destination: {destination}")
    print(f"Days: {days}")
    print(f"Budget: ${budget:.2f}")
    print(f"Travel Style: {travel_style}")
    total_cost = estimated_cost(hotel, food, transportation, miscs)
    if (total_cost > budget):
        print(f"⚠️ exceeded budget")
    else:
        print(f"Total Estimated Cost: ${total_cost:.2f}")


trip_summary("japan", 5, 1500, "family", 500, 50000, 200, 100)