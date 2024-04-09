"""
Utility functions for the Be Our Guest website
"""

from json import load
from .models import County, Venue, VenueType, WeddingType


def get_data(filepath: str) -> dict:
    """Get data from a json file

    Args:
        filepath (str): The path to the json file

    Returns:
        dict: Data from the json file
    """
    with open(filepath, "r", encoding="utf-8") as file:
        return load(file)


def setup_system_default_data() -> None:
    """Setup system default data for the Be Our Guest website"""
    filepath = "be_our_guest/system_default_data.json"
    data = get_data(filepath)

    counties = data["counties"]
    for county_json in counties:
        county = County()
        county.id = county_json["id"]
        county.name = county_json["name"]
        county.save()

    venue_types = data["venue_types"]
    for venue_type_json in venue_types:
        venue_type = VenueType()
        venue_type.id = venue_type_json["id"]
        venue_type.name = venue_type_json["name"]
        venue_type.save()

    venues = data["venues"]
    for venue_json in venues:
        venue = Venue()
        venue.id = venue_json["id"]
        venue.county = County.objects.get(id=venue_json["county"])
        venue.name = venue_json["name"]
        venue.address1 = venue_json["address1"]
        venue.address2 = venue_json["address2"]
        venue.address3 = venue_json["address3"]
        venue.zipcode = venue_json["zipcode"]
        venue.venue_type = VenueType.objects.get(id=venue_json["venue_type"])
        venue.save()

    wedding_types = data["wedding_types"]
    for wedding_type_json in wedding_types:
        wedding_type = WeddingType()
        wedding_type.id = wedding_type_json["id"]
        wedding_type.name = wedding_type_json["name"]
        wedding_type.save()
