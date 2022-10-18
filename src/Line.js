import * as CSV from "csv-string";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

var hasData = false;

// NEED FUNCTIONAL COMPONENT THAT
// WRAPS AROUND HIGHCHARTSREACT AND RETURNS
// ALERt SAYIING NEED VALID DATA UNLESS
// VALIID DATA IS ALREADY IN THE box

function equalLengths(csvFile) {
  let tmp = csvFile;
  let matchingFieldCounts = true;

  const firstLine = tmp[0];

  let rowNum = 0;

  /*
  
    for some reason, this function 
    isn't flagging the following as an error:

    "
    x, y
    1, 2
    3, 
    5, 6
    "

    and When the graph is applied, it 
    pretends as if the missing value is a 0.

   */

  while (matchingFieldCounts && rowNum < csvFile.length) {
    let rowLength = csvFile[rowNum].length;
    let sameLengths = rowLength === firstLine.length;

    let endVal = csvFile[rowNum][rowLength - 1];

    // all vals in list are of type "string"
    // console.log(typeof endVal);

    // endVal.length === 1;

    let missingEndVal = endVal === "";
    matchingFieldCounts = sameLengths && !missingEndVal;
    ++rowNum;
  }

  return matchingFieldCounts;
}

function MyFunctionalComponent(thechart, options, hasDataLoaded) {
  if (hasDataLoaded) {
    return <HighchartsReact highcharts={thechart} options={options} />;
  } else {
    return <p> (Data not yet loaded) </p>;
  }
}

const LineGraph = () => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState({ x: {}, y: {} });

  // Handle csv string...
  const handleSubmit = (event) => {
    // Sample csv...
    /*
    0,1,2 
     date, amount, spent
    2019-01-01, 10,100 
    2019-01-02, 20, 200
    */

    // CHQ: The goal of handleSubmit is to
    // take our CSV data that is internally
    // represented as a list of rows and
    // represent it as a list of columns.

    event.preventDefault();
    const { csv } = event.target.elements;

    const csvArray = CSV.parse(csv.value);

    if (csvArray.length < 3 || csvArray[0].length < 2) {
      alert("Enter valid CSV data that can be parsed!");

      // CHQ: FIXME: will find a way to not erase current data if data was already iniput but the current dataa is invalid
      setList([]);
    } else if (!equalLengths(csvArray)) {
      alert("Each header must have the same number of values!");
    } else {
      hasData = true;
      // Get headers....
      const headers = csvArray[0];

      // Remove headers from list...
      csvArray.splice(0, 1);
      const refinedList = [];
      // Now get values for each colums aka headers
      headers.forEach((headerPresent, indexThereIs) => {
        // Item list for each column aka header...
        const values = [];
        // Get items from the rows at index of header..
        csvArray.forEach((row) => {
          values.push(row[indexThereIs].trim());
        });

        // Now push to refined list of colums...
        refinedList.push({
          name: headerPresent.trim(),
          values: values
        });
      });

      // console.log(refinedList);
      // Set state...
      setList(refinedList);
    }
  };

  // Handle selection....
  const handleSelection = (event) => {
    event.preventDefault();

    if (list.length === 0) {
      alert("You must select a valid X AXIS and Y AXIS to proceed");
    } else {
      const { x, y } = event.target.elements;
      // Find selected item...
      console.log(list);
      const x_list = list.find((el) => el.name === x.value);
      const y_list = list.find((el) => el.name === y.value);

      // FIXME: CHQ: There should be a function to check
      // if an element can be found in a list. If so
      // x_list and y_list caan be set. Else, an alert should
      // appear and setSelected({ x: x_list, y: y_list });
      // should NOT be run.

      // FIXME: check values
      console.log(x_list);
      console.log(y_list);
      /*
      The following input doesn't break the code, but 
      the good news is that the code just ignores the 
      bad line and everything past it.

      input: 
      a, b
      1, 2
      3, 3
      4, "
      5, 6

      output:
      [ {name: a, values: [1, 3]}, 
        {name: b, values: [2, 3]} ]
      stored in state variable "list"

      */

      // Set selected x & y...
      setSelected({
        x: x_list,
        y: y_list
      });
    }
  };

  const options = {
    title: {
      text: "My chart"
    },
    xAxis: {
      title: {
        text: selected.x.name ? selected.x.name : "X-Axis"
      },
      categories: selected.x.values ? selected.x.values : []
    },

    yAxis: {
      title: {
        text: selected.y.name ? selected.y.name : "Y-Axis"
      }
    },
    // Hast to be integers...
    series: [
      {
        data: selected.y.values ? selected.y.values.map((el) => Number(el)) : []
      }
    ]
  };

  return (
    <section className="line-page">
      <h1>Line Graph</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="csv"
          placeholder="Paste csv here...."
          rows={10}
          required
        ></textarea>
        <button type="submit">Process</button>
      </form>

      <form style={{ marginTop: 30 }} onSubmit={handleSelection}>
        <select name="x" required>
          <option>X AXIS</option>
          {list.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
        <select name="y" required>
          <option>Y AXIS</option>
          {list.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
        <button type="submit">Apply</button>
      </form>
      <section style={{ marginTop: 20 }}>
        {/* <MyFunctionalComponent
          thechart={Highcharts}
          options={options}
          hasDataLoaded={false}
        /> */}
        <HighchartsReact highcharts={Highcharts} options={options} /> {/**/}
      </section>
    </section>
  );
};

export default LineGraph;
