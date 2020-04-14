function d3_korea_map( _mapContainerId, _spots){
	var WIDTH, HEIGHT,
	CENTERED
	MAP_CONTAINER_ID = _mapContainerId;
	var SPECIAL_CITIES = ['서울특별시', '인천광역시', '대전광역시', '대구광역시', '부산광역시', '울산광역시', '광주광역시', '세종특별자치시', '제주특별자치도'];
	var projection, path, svg,
	geoJson, features, bounds, center,
	map, places, zoom, g, active = d3.select(null);
	function create( callback){
		WIDTH = 4000,
		HEIGHT = 2400;
		
		projection = d3.geoMercator().scale(8000)
		    .translate( [WIDTH / 2, HEIGHT / 2]);
		
		
		
		zoom = d3.zoom()
			.scaleExtent([1, 8])
			.on("zoom", zoomed);
		
		path = d3.geoPath()
		    .projection(projection);
		
		svg = d3.select(MAP_CONTAINER_ID).append("svg")
	    .attr("width", WIDTH)
	    .attr("height", HEIGHT)
	    .on("click", stopped, true); 
		
		g = svg.append("rect")
	    .attr("width", WIDTH)
	    .attr("height", HEIGHT)
	    .on("click", reset);

		 
		map = svg.append("g").attr( "id", "map");
			places = svg.append( "g").attr( "id", "places");
		
		
		
		g.call(zoom);
		//map.call(zoom);
		// load and display the World
		d3.json(KOREA_JSON_DATA_URL).then(function(_data) {
			geoJson = topojson.feature( _data, _data.objects.skorea_municipalities_geo);
		    features = geoJson.features;
		    bounds = d3.geoBounds( geoJson);
            center = d3.geoCentroid( geoJson);
 
            var distance = d3.geoDistance( bounds[0], bounds[1]);
            var scale = HEIGHT / distance / Math.sqrt(2) * 1.2;
 
            projection.scale( scale).center( center);
 
            console.log( "center", center);
            console.log( "scale", scale);
		    map.selectAll("path")
		       .data( features)
		                .enter().append( "path")
		                .attr( "class", function(d) { console.log(d);
		                    return "municipality c " + d.properties.code;})
		                .attr( "d", path)
		                .attr("class", "feature")
		                .on("click", clicked);
		    
		   
		    
			callback();
		});
	}
	function clicked(d) {
		  if (active.node() === this) return reset();
		  active.classed("active", false);
		  active = d3.select(this).classed("active", true);

		  var bounds = path.bounds(d),
		      dx = bounds[1][0] - bounds[0][0],
		      dy = bounds[1][1] - bounds[0][1],
		      x = (bounds[0][0] + bounds[1][0]) / 2,
		      y = (bounds[0][1] + bounds[1][1]) / 2,
		      scale = Math.max(1, Math.min(8, 0.85 / Math.max(dx / WIDTH, dy / HEIGHT))),
		      translate = [WIDTH / 2 - scale * x, HEIGHT / 2 - scale * y];
		  
		  map.transition()
		      .duration(750)
		      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
	}
	function reset() {
		  active.classed("active", false);
		  active = d3.select(null);

		  map.transition()
		      .duration(750)
		      .attr("transform", "");
	}
	function zoomed() {
		    map.attr("transform", d3.event.transform);
	}
	function stopped() {
		  if (d3.event.defaultPrevented) d3.event.stopPropagation();
	}
	create( function(){
        
    })
}