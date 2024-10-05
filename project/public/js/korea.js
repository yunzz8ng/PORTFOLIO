window.onload = function () {
    drawMap('#container');
};

function openFesitval(local) {
    const options = "width=1300, height=800, top=50%, left= 50%";
    window.open(`http://localhost:3000/festival/${local}`, "_blank", options);
}
//지도 그리기
function drawMap(target) {
    var width = 1000; //지도의 넓이
    var height = 1000; //지도의 높이
    var initialScale = 5500; //확대시킬 값
    var initialX = -12000; //초기 위치값 X
    var initialY = 4150; //초기 위치값 Y
    var labels;

    var projection = d3.geo
        .mercator()
        .scale(initialScale)
        .translate([initialX, initialY]);
    var path = d3.geo.path().projection(projection);

    var zoom = d3.behavior
        .zoom()
        .translate(projection.translate())
        .scale(projection.scale())
        .scaleExtent([height, 800 * height])
    // .on('zoom', zoom);

    var svg = d3
        .select(target)
        .append('svg')
        .attr('width', width + '%')
        .attr('height', height + 'vh')
        .attr('id', 'map')
        .attr('class', 'map');

    var states = svg
        .append('g')
        .attr('id', 'states')
        .call(zoom);


    states
        .append('rect')
        .attr('class', 'background')
        .attr('width', width + '%')
        .attr('height', height + 'vh')
        .attr('fill', '#008080');

    //geoJson데이터를 파싱하여 지도그리기
    // * alert 기능 삽입 구간 d3.json 부터 labels = states 포함 .on('click) 이부분 alert
    // to(do); **************************
    // ************************x*çn

    d3.json('js/korea.json', function (json) {
        states
            .selectAll('path') //지역 설정
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'map-path')
            .attr('id', function (d) {
                return 'path-' + d.properties.name_eng;
            }).on('click', (e) => {
                console.log(e.properties.name)
                // alert(e.properties.name);
                openFesitval(e.properties.name);
            });

        labels = states
            .selectAll('text')
            .data(json.features) //라벨표시
            .enter()
            .append('text')
            .attr('transform', translateTolabel)
            .attr('id', function (d) {
                return 'label-' + d.properties.name_eng;
            })
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(function (d) {
                return d.properties.name;
            }).on('click', (e) => {
                console.log(e.properties.name)
                alert(e.properties.name);
            });
    });

    //텍스트 위치 조절 - 하드코딩으로 위치 조절을 했습니다.
    function translateTolabel(d) {
        var arr = path.centroid(d);
        if (d.properties.code == 31) {
            //서울 경기도 이름 겹쳐서 경기도 내리기
            arr[1] +=
                d3.event && d3.event.scale
                    ? d3.event.scale / height + 20
                    : initialScale / height + 20;
        } else if (d.properties.code == 34) {
            //충남은 조금 더 내리기
            arr[1] +=
                d3.event && d3.event.scale
                    ? d3.event.scale / height + 10
                    : initialScale / height + 10;
        }
        return 'translate(' + arr + ')';
    }

    function zoom() {
        projection.translate(d3.event.translate).scale(d3.event.scale);
        states.selectAll('path').attr('d', path);
        labels.attr('transform', translateTolabel);
    }
}
