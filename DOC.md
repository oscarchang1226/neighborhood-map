### Requirements
- Google Maps API displaying map of the neighborhood.
- Have markers drop on popular location.
- Have search for popular location in the neighborhood.
- List view of all popular location in the neighborhood.
- Show details of the location when location marker is clicked.
- Use _KnockoutJS_.
- Use _Google Maps API_.
- Use any 3rd party API. (Ex: Yelp, New York Times, etc.)

### Model
- Locations.
- Search term.

### View
- Search input box.
- List of locations.
- Map

### View Model
- Submitting search term.
- Click on location.
- Click on marker.

### TODO
- [ ] Add filter options.
    - [ ] Load all locations.
    - [ ] Select filter by categories.
    - [ ] Input filter by business name.
- [ ] Clicking on location list animate selected marker.
    - Hovering animation does not count.
- [ ] Chain `fail` method after done method in AJAX request.
- [ ] Provide fallback error handling method for `async` google maps API usage.
    - Research how to perform asynchronous request and provide error handler with RequireJS.
