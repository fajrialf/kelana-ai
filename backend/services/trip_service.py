
def get_trip_category(budget):
    if budget < 1000:
        return "backpacker"
    elif budget <= 3000:
        return "standard"
    else:
        return "luxury"
    
def calculate_daily_budget(budget,days):
    return budget/days

def get_recommended_places():    
    recommended_place = [
        "Tokyo Tower",
        "Shibuya",
        "Mount Fuji",
    ]
    return recommended_place

def get_transportation_recommendation(category):
    category = category.lower()
    if category == "backpacker":
        return "Bus"
    elif category == "standard":
        return "Train"
    else:
        return "Flight"

def get_travel_season(month):
    month = month.lower()
    if month in ["december","12"]:
        return "Peak Season"
    elif month in ["june","6"]:
        return "Holiday Season"
    else:
        return "Regular Season"
    
def get_trip_categories():
    return ["backpacker","standard", "luxury"]