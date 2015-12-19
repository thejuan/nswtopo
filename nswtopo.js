function initMap() {
    var showAbout = document.getElementById('show-about')
    var about = document.getElementById('about');
    var title = document.getElementById('title');
    var toggles = document.getElementById('toggles');
    var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        streetViewControl: false,
    });
    map.data.loadGeoJson('maps.json', {}, function(features) {
        var states = [];
        var scales = [];
        var bounds = new google.maps.LatLngBounds();
        features.forEach(function(feature) {
            feature.getGeometry().getAt(0).getArray().forEach(function(point) {
                bounds.extend(point);
            })
            feature.setProperty('scale', feature.getProperty('scale') / 1000 + 'k');
            if (states.indexOf(feature.getProperty('state')) < 0)
                states.push(feature.getProperty('state'));
            if (scales.indexOf(feature.getProperty('scale')) < 0)
                scales.push(feature.getProperty('scale'));
        });
        map.fitBounds(bounds);
        states.forEach(function(state) {
            var element = document.createElement('div');
            element.textContent = state;
            element.id = 'show-' + state;
            element.classList.add('selected');
            toggles.appendChild(element);
            element.addEventListener('click', function() {
                var selected = element.classList.toggle('selected')
                features.filter(function(feature) {
                    return feature.getProperty('state') === state;
                }).filter(function(feature) {
                    return !selected || document.getElementById('show-' + feature.getProperty('scale')).classList.contains('selected');
                }).forEach(function(feature) {
                    map.data.overrideStyle(feature, { visible: selected });
                });
            });
        });
        scales.forEach(function(scale) {
            var element = document.createElement('div');
            element.textContent = scale;
            element.id = 'show-' + scale;
            element.classList.add('selected');
            toggles.appendChild(element);
            element.addEventListener('click', function() {
                var selected = element.classList.toggle('selected')
                features.filter(function(feature) {
                    return feature.getProperty('scale') === scale;
                }).filter(function(feature) {
                    return !selected || document.getElementById('show-' + feature.getProperty('state')).classList.contains('selected');
                }).forEach(function(feature) {
                    map.data.overrideStyle(feature, { visible: selected });
                });
            });
        });
    });
    map.data.setStyle(function(feature) {
        var scale = feature.getProperty('scale');
        var colour = scale === '25k' ? '#FF0000' : scale === '50k' ? '#0000FF' : '#FF00FF';
        return {
            strokeColor: colour,
            fillColor: colour,
            strokeOpacity: 0.8,
            fillOpacity: 0.15,
            strokeWeight: 1,
        };
    });
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('select'));
    showAbout.addEventListener('click', function() {
        showAbout.classList.toggle('selected');
        about.classList.toggle('hidden');
    });
    map.data.addListener('click', function(event) {
        window.open(event.feature.getProperty('url'));
    });
    map.data.addListener('mouseover', function(event) {
        map.data.overrideStyle(event.feature, { strokeWeight: 4});
        var span = document.createElement('span');
        span.textContent = event.feature.getProperty('title');;
        title.appendChild(span);
    });
    map.data.addListener('mouseout', function(event) {
        map.data.overrideStyle(event.feature, { strokeWeight: 1});
        title.innerHTML = null;
    });
    function hideAbout() {
        showAbout.classList.remove('selected');
        about.classList.add('hidden');
    };
    google.maps.event.addDomListener(map, 'mousedown', hideAbout);
    map.data.addListener('mousedown', hideAbout);
    document.getElementById('close').addEventListener('click', hideAbout);
};
