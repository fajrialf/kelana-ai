
def get_trip_category(budget):
    if budget < 1000:
        return "backpacker"
    elif budget <= 3000:
        return "standard"
    else:
        return "luxury"
    
def calculate_daily_budget(budget,days):
    return budget/days

def print_recommended_places():    
    recommended_place = [
        "Tokyo Tower",
        "Shibuya",
        "Mount Fuji",
    ]

    print(f"\nRecommended Places:\n")
    for place in recommended_place:
        print(f"- {place}")

def print_transportation_recommendation(category):
    category = category.lower()
    if category == "backpacker":
        print("\nRecommended Transportation: Bus")
    elif category == "standard":
        print("\nRecommended Transportation: Train")
    else:
        print("\nRecommended Transportation: Flight")

def get_travel_season(month):
    month = month.lower()
    if month in ["december","12"]:
        return "Peak Season"
    elif month in ["june","6"]:
        return "Holiday Season"
    else:
        return "Regular Season"