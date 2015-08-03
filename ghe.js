//====================================================================================================
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
    //amperometro.append('rect').attr('x',w[0]).attr('y',w[1]+w[3]).attr('height',45).attr('width',w[2]) // vale per verticale
    
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


function createSVG(){
    return d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
}

    var drag = d3.behavior.drag()
    //.on("dragstart", dragstarted)
	.on("drag", dragged);
    //.on("dragend", dragended);
    
function dragged(d) {
    var t=d3.select(this);                                                                                                                                  
    var x=d3.transform(t.attr('transform')).translate[0]+d3.event.dx;
    var y=d3.transform(t.attr('transform')).translate[1]+d3.event.dy;
    d3.select(this).attr('transform', 'translate('+ x +','+ y +')');
    
    }

function redraw(or) {
    
    if (amperometro) {
	var val=amperometro.select('#data').datum().value;
	amperometro.remove();
    }    
    amperometro_properties.axis_orient=or;    
    amperometro=createStrumento(amperometro_properties);
    amperometro.call(drag);
}

function drawbox(str) {
    
    str.append('rect')
    	.attr("x",str.node().getBBox().x)
    	.attr("y",str.node().getBBox().y)
    	.attr('width',str.node().getBBox().width)
    	.attr('height',str.node().getBBox().height)
    	.attr('fill','none').attr('stroke','green')
    str.append('circle')
    	.attr('cx',str.node().getBBox().x)
    	.attr('cy',str.node().getBBox().y)
    	.attr('r',2)
    	.attr('fill','red');
    return [str.node().getBBox().x,str.node().getBBox().y,str.node().getBBox().width,str.node().getBBox().height];
}

function initDashBoard() {
    
    d3.select("body").append("div").attr("id","strumenti").attr("style","background-color: azure; width: 425px; float:left");
    amperometro=createStrumento(amperometro_properties);
    voltmetro=createStrumento(voltmetro_properties);
    wattmetro=createStrumento(wattmetro_properties);
    pressostato=createStrumento(pressostato_properties);
    pressostato_pozzo=createStrumento(pressostato_pozzo_properties);
    
    var n=0;
    d3.select("body").append("div").attr("id","IO").attr("style","float:left; background-color: aqua; width: 145px; height: 500px");
    d3.select("body").append("div").attr("id","hb");//.attr("style","float:left;");
    // $('#hb').html('*');
   var ws = new WebSocket('ws://' + 'giannini.homeip.net' + ':81','energy'); // Hearth Beat
   // var ws = new WebSocket('ws://' + '192.168.1.103' + ':81','energy');
    
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
	$('#IO').html('</br>');
//	$('#IO').html(JSON.parse(event.data).IO1);
//	$('#IO').append(JSON.parse(event.data).IO2);

	$('#IO').append(JSON.parse(event.data).Stati.Aut + '<p>' + ':Autoclave' + '</p></br>');
	$('#IO').append(JSON.parse(event.data).Stati.Pozzo + ':posso' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.Riemp + ':riempimento serbatoio' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.LE + ':luci esterne' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.LG_4 + ': luci garage da 4' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.LG_2 + ':luce garage da 2' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.Tav1 + ':taverna 1' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.Tav2 + ':taverna 2' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.INT + ':internet' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.C9912 + ':9912' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.culu + ':Cunicolo lungo' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.cuco + ':Cunicolo corto' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.lust + ':luci studio sotto' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.luansc + ':luci scale sotto' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.genaut + ':Generale autoclave' + '</br>');
	$('#IO').append(JSON.parse(event.data).Stati.lucant + ':luce cantinetta' + '</br>');

	var c = $('#hb').html();
	n++;
	//alert(c);
	if (n == 5) {
	    if (c=='*') {
		$('#hb').html('&nbsp');
	    } else {
		$('#hb').html('*');
	    }
	    n=0;
	}
	
    }    
}

  
