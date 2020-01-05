function renderDotChart(weatherConditions, accidentsByWeatherConditions){
    var weatherConditions = ['Switzerland (2011)', 'Chile (2013)', 'Japan (2014)', 'United States (2012)', 'Slovenia (2014)', 'Canada (2011)', 'Poland (2010)', 'Estonia (2015)', 'Luxembourg (2013)', 'Portugal (2011)'];
    var accidentsByWeatherConditions = [16000.1, 42, 52.7, 84.3, 51.7, 61.1, 55.3, 64.2, 91.1, 58.9];

    var trace1 = {
        type: 'scatter',
        x: weatherConditions,
        y: accidentsByWeatherConditions,
        mode: 'markers',
        name: 'Percent of estimated voting age population',
        marker: {
          color: 'rgba(156, 165, 196, 0.95)',
          line: {
            color: 'rgba(156, 165, 196, 1.0)',
            width: 1,
          },
          symbol: 'circle',
          size: 16
        }
      };

      var data = [trace1];

      var layout = {
        title: 'Votes cast for ten lowest voting age population in OECD countries',
        xaxis: {
          showgrid: false,
          showline: true,
          linecolor: 'rgb(102, 102, 102)',
          titlefont: {
            font: {
              color: 'rgb(204, 204, 204)'
            }
          },
          tickfont: {
            font: {
              color: 'rgb(102, 102, 102)'
            }
          },
          autotick: false,
          dtick: 10,
          ticks: 'outside',
          tickcolor: 'rgb(102, 102, 102)'
        },
        margin: {
          l: 140,
          r: 40,
          b: 50,
          t: 80
        },
        legend: {
          font: {
            size: 10,
          },
          yanchor: 'middle',
          xanchor: 'right'
        },
        width: 600,
        height: 500,
        paper_bgcolor: 'rgb(254, 247, 234)',
        plot_bgcolor: 'rgb(254, 247, 234)',
        hovermode: 'closest'
      };

      Plotly.newPlot('weather', data, layout);
}