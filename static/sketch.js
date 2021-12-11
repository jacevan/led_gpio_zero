function getData() {
  d3.json('./gpio', (data) => {
    const numPins = Object.keys(data).length;
    renderPi(true, numPins);
  });
}
setInterval(() => {
  getData();
}, 1000);

function renderPi (isOn, pinCount) {
  const container = d3.select('#piContainer');
  if (container.selectAll('.piSvg').empty()) {
    container.append('svg')
      .attr('class', 'piSvg');
  }
  const width = container.node().getBoundingClientRect().width;
  const height = container.node().getBoundingClientRect().height;
  const pinRadius = 6; // TODO - make this adjust dynamically to the height to ensure all pins fit
  const ledRadius = 25;

  const piSvg = container.select('.piSvg')
    .attr('width', width)
    .attr('height', height);

  const drawOutline = (boardGroup, groupData) => {
    const outline = boardGroup.selectAll('.piOutline')
      .data([groupData]);
    outline.enter()
      .append('rect')
      .attr('class', 'piOutline')
      .attr('x', 0)
      .attr('y', 0)
      .attr("rx", 8)
      .merge(outline)
      .attr('width', d => d.piWidth)
      .attr('height', d => d.piHeight);
    outline.exit().remove();
  }

  const drawLED = (boardGroup, ledData) => {
    const ledGroup = boardGroup.selectAll('.ledGroup')
      .data([ledData]);

    const arcGenerator = (radius) => {
      return d3.arc()
        .outerRadius(radius)
        .innerRadius(0)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);    
    } 
    ledGroup.enter()
      .append('g')
      .attr('class', 'ledGroup')
      .merge(ledGroup)
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .each(function (ledData) {
        const arc = d3.select(this).selectAll('.ledBulb')
          .data([ledData]);
        arc.enter()
          .append('path')
          .attr('class', 'ledBulb')
          .merge(arc)
          .transition()
          .duration(500)
          .style('fill', d => d.isOn ? '#e9c46a' : '#000')
          .attr('d', arcGenerator(ledRadius));
        arc.exit().remove(); 
        
        const pins = d3.select(this).selectAll('.ledPin')
          .data([
            {x: -10, height: ledRadius / 2},
            {x: 10, height: ledRadius}
          ]);
        pins.enter()
          .append('line')
          .attr('class', 'ledPin')
          .attr('stroke-width', 2)
          .merge(pins)
          .attr('x1', d => d.x)
          .attr('x2', d => d.x)
          .attr('y1', 0)
          .attr('y2', d => d.height);
        
        pins.exit().remove();
      });
  }

  const drawPins = (boardGroup, groupData) => {
    const pinsGroup = boardGroup.selectAll('.pinsGroup')
      .data([groupData]);
    pinsGroup.enter()
      .append('g')
      .attr('class', 'pinsGroup')
      .merge(pinsGroup)
      .attr('transform', (d) => `translate(${d.piWidth - (pinRadius * 5.75)}, ${pinRadius})`)
      .each(function (d) {
        const pinsOutline = d3.select(this).selectAll('.pinsOutline')
          .data([d]);
        pinsOutline
          .enter()
          .append('rect')
          .attr('class', 'pinsOutline')
          .attr('x', 0)
          .attr('y', 0)
          .merge(pinsOutline)
          .attr('height', ((pinRadius * .25) + (2.25 * pinRadius) * (pinCount / 2)))
          .attr('width', d => pinRadius * 4.75);
        pinsOutline.exit().remove();

        const pins = [];
        for (var i = 1; i <= pinCount; i++) {
          pins.push(i);
        }
        const pinGroups = d3.select(this).selectAll('.pinGroup')
          .data(pins);
        pinGroups.enter()
          .append('g')
          .attr('class', 'pinGroup')
          .merge(pinGroups)
          .attr('transform', (d, i) => {
            const x = (pinRadius * 1.25) + (i % 2 * (pinRadius * 2.25));
            const y = (pinRadius * 1.25) +  Math.floor(i / 2) * (pinRadius * 2.25);
            return `translate(${x}, ${y})`;
          })
          .each(function (pin) {
            const pinCircle = d3.select(this).selectAll('.pinCircle')
              .data([pin]);
            pinCircle.enter()
              .append('circle')
              .attr('class', 'pinCircle')
              .attr('cx', 0)
              .attr('cy', 0)
              .attr('r', pinRadius);
            pinCircle.exit().remove();

            const pinText = d3.select(this).selectAll('.pinText')
              .data([pin]);
            pinText.enter()
              .append('text')
              .attr('class', 'pinText')
              .style('font-size', `${Math.max(Math.min(pinRadius * 2 - 4, 12), 8)}px`)
              .text(pin => pin);
            pinText.exit().remove();
          });
        pinGroups.exit().remove();
      });
    pinsGroup.exit().remove();
  }

  const drawBoard = () => {
    const getBoardWidth = (totalWidth) => {
      return totalWidth * (1 / 2);
    }

    const getBoardHeight = (totalHeight) => {
      return totalHeight * (3 / 4);
    }
    const boardGroup = piSvg.selectAll('.piGroup')
      .data([{width, height}]);
    boardGroup.enter()
      .append('g')
      .attr('class', 'piGroup')
      .merge(boardGroup)
      .attr('transform', (d) => `translate(${d.width / 4}, ${d.height / 8})`)
      .each(function (groupData) {
        const piData = {
          piWidth: getBoardWidth(width), 
          piHeight: getBoardHeight(groupData.height)
        }; 
        const ledData = {
          x: getBoardWidth(width) + 50,
          y: 0,
          isOn: isOn
        }
        drawOutline(d3.select(this), piData);
        drawPins(d3.select(this), piData);
        drawLED(d3.select(this), ledData);
      });
    boardGroup.exit().remove();
  }
  drawBoard();
}
