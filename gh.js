//====================================================================================================
// Funzione per la creazione degli assi graduati
//====================================================================================================
function createStrumento(strumento_properties) {    
    // empty containers

    var strumento=d3.select("#strumenti").append("svg")
	.attr("width", 85)
        .attr("height", height)
        .attr("float","left")
	.append("g").attr("id",strumento_properties.name);
    var axis=strumento.append("g").attr("id","axis").attr("class","axis");
    var cursor=strumento.append("g").attr("id","cursor").attr("class","cursor");
    var data=strumento.append("g").attr("id","data");
    var digit=strumento.append("g").attr("id","digit");

    ///////////////////////////////
    // AXIS
    // scale
    var orient=strumento_properties.axis_orient;

    // asse verticale: il minimo in basso; asse orizzontale: il minimo a sx:
    (orient == "left" || orient=="right")?
	strumento_properties.scaleparam.range.sort(function(a, b){return b-a}):
    strumento_properties.scaleparam.range.sort(function(a, b){return a-b});

    var s=d3.scale.linear()
	.domain(strumento_properties.scaleparam.domain)
	.range(strumento_properties.scaleparam.range);
    strumento_properties.scale=s;
    axis.call( d3.svg.axis().scale(s).orient(orient) );

    //////////////////////////////
    // CURSOR
    var b=strumento_properties.cursor_base;
    var value=d3.min(strumento_properties.scaleparam.domain);
    strumento_properties.value=value;
    var vx,vy,cp;
    vy=(orient == "left" || orient=="right")?s(value):0;
    vx=(orient == "top" || orient=="bottom")?s(value):0;
    cp= [vx-b/2,vy+2*b,  // cp0 vertice in basso a sx
         vx+b/2,vy+2*b,  // cp1 vertice in basso a dx
         vx,vy];         // cp2 vertice o punta del triangolo
    var rotate;
    switch (orient) {
	case "left": rotate=-90;
	break;
	case "right": rotate=90;
	break;
	case "top": rotate=0;
	break;
	case "bottom": rotate=180;
	break;
    }
    strumento_properties.vx=vx;
    strumento_properties.vy=vy;
    cursor.append("polygon")
     	.attr("points",cp)
     	.attr("transform", "rotate("+ rotate + "," + vx + "," + vy +")")
    	.on("dblclick", function(){
            d3.select(this)
    		.transition()
    		.attr("transform", "rotate("+ (rotate+=90) +"," + vx + "," + vy +")")});

    //////////////////////////////
    // DATA ax.append('g').attr("id","data").datum(axis_properties);
    data.datum(strumento_properties);

    //////////////////////////////
    // // posiziona
    // // sposta l'asse e il cursore il giusto per farlo rimanere nello schermo
    var bboxx = strumento.node().getBBox().x<0?(-1*(strumento.node().getBBox().x)):0;
    var bboxy = strumento.node().getBBox().y<0?(-1*(strumento.node().getBBox().y)):0;

    //////////////////////////////////
    // Display digit
    //////////////////////////////////
    strumento.attr("transform","translate("+ (bboxx) +"," + (bboxy) +")");
    if ((orient == "left" || orient=="right")) {
	var dx=strumento.node().getBBox().x;
	var dy=strumento.node().getBBox().y + strumento.node().getBBox().height+15;
    } else { // orizzontale
	var dx=strumento.node().getBBox().x+strumento.node().getBBox().width+5;
	var dy=strumento.node().getBBox().y+(strumento.node().getBBox().height)/2;
    }

    digit.append('text')
	.attr('class','digit')
	.attr('x',dx)
	.attr('y',dy)
	.text('');

    return strumento;
}


/////////
// MOVE
/////////
function move(str,valore) {

    var val_abs=str.select('#data').datum().scale(valore);

    var val_x=str.select('#data').datum().vx;
    var val_y=str.select('#data').datum().vy;

    var translatex=0;
    var translatey=0;
    var cursor=str.select('#cursor');
    var dig=str.select('#digit');
    if (val_x==0) {
	// left|right
	var translatey=val_abs-val_y;
	
    } else {
	// top|bottom	
	var translatex=val_abs-val_x;
    }
    //str.select('#data').datum().value=valore;
    cursor.transition().attr('transform','translate('+ translatex + ',' + translatey + ')');    
    dig.select('text').text(valore);
}

//====================================================================================================
// Funzione per la creazione delle SPIE luminose
//====================================================================================================

function createSpia(spia_properties) {
    var spia=d3.select('#spie').append("svg")
	.attr("width", (spia_properties.r)*2+1)
        .attr("height", (spia_properties.r)*2+1)
	.attr("id",spia_properties.name)
	.append("g").attr("id","s");

    var cx=spia.node().getBBox().x+(spia_properties.r);
    var cy=spia.node().getBBox().y+(spia_properties.r);
    
    spia.append("circle")
	.attr("cx",cx)
	.attr("cy",cy)
	.attr("r",spia_properties.r)

	.style("fill",spia_properties.bordercolor);
    
    spia.append("circle")
	.attr("cx",cx)
	.attr("cy",cy)
	.attr("r",spia_properties.r-2)

	.style("fill",spia_properties.colorON);

    return spia
};
/*
Also, it's fairly easy to replicate items using D3 itself, by wrapping
whatever you are about to add in an svg:g element and then using
selectAll + data + enter + append.
*/	       
//====================================================================================================
// Funzione per la creazione dei bottoni di comando
//====================================================================================================


//====================================================================================================
//====================================================================================================


var height = 500, width = 500;


var voltmetro_properties={ "scaleparam": {"range":[10,height-60], "domain":[200,240]}
		    ,"cursor_base":10
		    ,"axis_orient":'left'
		    ,"name":"voltmetro"
		   };

var amperometro_properties={ "scaleparam": {"range":[10,height-60], "domain":[0,24]}
		    ,"cursor_base":10
		    ,"axis_orient":'left'
		    ,"name":"amperometro"
		   };
var wattmetro_properties={"scaleparam": {"range":[10,height-60], "domain":[0,5]}
                    ,"cursor_base":10
                    ,"axis_orient":'left'
                    ,"name":"wattmetro"
                   };
var pressostato_properties={"scaleparam": {"range":[10,height-60], "domain":[0,6]}
                    ,"cursor_base":10
                    ,"axis_orient":'left'
                    ,"name":"pressostato"
                   };
var pressostato_pozzo_properties={"scaleparam": {"range":[10,height-60], "domain":[0,10]}
                    ,"cursor_base":10
                    ,"axis_orient":'left'
                    ,"name":"pressostato pozzo"
                   };
//----------------------------------------------------------------------------------------

var array_spie;
var assoc_artray_bobine;
var n=0;

function initDashBoard() {
    
    d3.select("body").append("div").attr("id","strumenti").attr("style","background-color: #E4E2EE; width: 425px; float:left");
    d3.select("body").append("div").attr("id","spie").attr("style"," width: 145px; height: 500px; float:left");
    d3.select("body").append("div").attr("id","bobine").attr("style"," width: 145px; height: 500px; float:left");
    d3.select("body").append("div").attr("id","hb").attr("style","background-color: orange; width: 10px; height: 10px; float:left;");

    amperometro=createStrumento(amperometro_properties);
    voltmetro=createStrumento(voltmetro_properties);
    wattmetro=createStrumento(wattmetro_properties);
    pressostato=createStrumento(pressostato_properties);
    pressostato_pozzo=createStrumento(pressostato_pozzo_properties);

    var ws_spie_bobine = new WebSocket('ws://' + '192.168.1.103' + ':8081','spie_bobine');
    ws_spie_bobine.onmessage = function (event) {
	assoc_array_spie=JSON.parse(event.data).spie;
	assoc_array_bobine=JSON.parse(event.data).bobine;
	ws_spie_bobine.close();

	ts=d3.select("#spie").append("table").attr("class","tspie").attr("style","width:100%");
	tsb=ts.append("tbody");    
	tsb.selectAll("tr")
	    .data(d3.keys(assoc_array_spie))
	    .enter()
	    .append("tr")
	    .append("td")
//  	    .on("click",function (d) {ws.send(d)})
	    .attr("id",function (d) {return d})
	    .html(function (d) {return assoc_array_spie[d]});

	tb=d3.select("#bobine").append("table").attr("class","tbobine").attr("style","width:100%");
	tbb=tb.append("tbody"); 
	tbb.selectAll("tr")
	    .data(d3.keys(assoc_array_bobine))
	    .enter()
	    .append("tr")
	    .append("td")
	    .on("mouseover",function(){d3.select(this).attr("class", "tdover")})
	    .on("mouseleave",function(){d3.select(this).attr("class", "tdoff")})
	    .on("mousedown",function(){d3.select(this).attr("class", "tdon")})
	    .on("mouseup",function(){d3.select(this).attr("class", "tdoff")})
  	    .on("click",function (d) {ws.send(assoc_array_bobine[d])}) // sparo sul socket WS che riceve i dati
	    .attr("id",function (d) {return d})
	    .html(function (d) {
		if (assoc_array_spie[d]) {
		    return assoc_array_spie[d];
		} else { return d };
		  }
		 );
    };

    var ws = new WebSocket('ws://' + '192.168.1.103' + ':8081','energy');
    ws.onmessage = function (event) {
	var A=parseFloat(JSON.parse(event.data).Energia.I);
	var V=parseFloat(JSON.parse(event.data).Energia.V);
	var W=parseFloat(JSON.parse(event.data).Energia.P);    
	var Bar=parseFloat(JSON.parse(event.data).Bar);
	var Bar_pozzo=parseFloat(JSON.parse(event.data).Bar_pozzo);
	move(amperometro,A);
	move(voltmetro,V);
	move(wattmetro,W);
	move(pressostato,Bar);
	move(pressostato_pozzo,Bar_pozzo);

	$.each(assoc_array_spie, function(index, value) {
	    if (JSON.parse(event.data).Stati[index]==1) {
		d3.select('#'+index).attr("class","tdon");
	    } else {
		d3.select('#'+index).attr("class","tdoff");
	    }
	    
	});	

	var c = $('#hb').html();
	n++;
	if (n == 5) {
	    if (c=='*') {
		$('#hb').html('&nbsp');
	    } else {
		$('#hb').html('*');
	    }
	    n=0;
	}
	
    } // ws.onmessage
}

  
