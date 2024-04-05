// Establish the URL of the Data
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// Access and store the data
d3.json(url).then(function(data) {
    // Log the data to check if it's loaded properly
    console.log(data);

    // Extract data
    const samples = data.samples;

    //  Dropdown menu
    const dropdown = d3.select("#selDataset");

    // Populate dropdown menu
    dropdown.selectAll("option")
        .data(samples)
        .enter()
        .append("option")
        .text(function(d) { return d.id; })
        .attr("value", function(d) { return d.id; });

    // Initial chart with the first sample
    updateChart(samples[0]);

    // Dropdown change event listener
    dropdown.on("card card-primary", function() {
        const selectedId = this.value;
        const selectedSample = samples.find(sample => sample.id === selectedId);
        updateChart(selectedSample);
        BubbleChart(selectedId); 
    });

    // Function
    function updateChart(sample) {
        
        const top10Values = sample.sample_values.slice(0, 10);
        const top10Labels = sample.otu_ids.slice(0, 10).map(id => "OTU " + id);
        const hoverText = sample.otu_labels.slice(0, 10);

        // Define trace for the bar chart
        const barTrace = {
            x: top10Values,
            y: top10Labels,
            text: hoverText,
            type: "bar",
            orientation: "h"
        };

        // Plot the bar chart
        Plotly.newPlot("bar", [barTrace]);
    };

    // Create bubble chart
    function BubbleChart(sample) {
        // D3 to retrieve all of the data
        d3.json(url).then((data) => {
            // Retrieve all sample data
            let sampleInfo = data.samples;
            // Filter
            let value = sampleInfo.filter(result => result.id == sample);
            // Get the first index
            let valueData = value[0];
            // Get the otu_ids, labels, and sample values
            let otu_ids = valueData.otu_ids;
            let otu_labels = valueData.otu_labels;
            let sample_values = valueData.sample_values;

            // Set up trace for bubble chart
            let trace1 = {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            };

            // Set up layout
            let layout = {
                hovermode: "closest",
                xaxis: {title: "OTU ID"}
            };

            // Plot the bubble chart
            Plotly.newPlot("bubble", [trace1], layout);
        });
    }

    // Initialize
    updateChart(samples[0]);
    BubbleChart(samples[0].id);
});