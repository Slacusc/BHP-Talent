import Papa, { parse } from "papaparse"
import * as XLSX from "xlsx"
import { useState } from 'react'
import DataTable from "react-data-table-component"
import './App.css'

const Loader = () => {
  return (
    <div>
      <h3>Cargando BHP Payroll...</h3>
    </div>
  )
}


const App = () => {

  const [parsedData, setParsedData] = useState([])
  const [parsedData2, setParsedData2] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(false)


  const readFile = () => {

    const e = document.getElementById("file1")
    const [file1] = e.files
    if(!file1){
      console.log("nope")
      return
    }

    
    const b = document.getElementById("file2")
    const [file2] = b.files
    if(!file2){
      console.log("nope")
      return
    }

    // console.log([file1])
    // console.log([file2])
    setLoading(true)

    const reader = new FileReader()
    const reader2 = new FileReader()

    reader.onload = (evt) => {
      const bstr =evt.target.result  
      const wb = XLSX.read(bstr, {type: "binary"})
      const wsname =wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1})
      parseFile(data)
  
      // console.log(data)
    }
    reader.readAsBinaryString(file1)

    reader2.onload = (evt) => {
      const bstr =evt.target.result  
      const wb = XLSX.read(bstr, {type: "binary"})
      const wsname =wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1})
      parseFile2(data)
  
      // console.log(data)
    }
    reader2.readAsBinaryString(file2)
    
  }

  const createColumns = (data) => {
    const columns = []
    data.forEach((item) => {
      columns.push({
        name: item,
        selector: row =>row[item],
        sortable: true
      })
      
    })
    

    setColumns(columns)
    


  }
  
 


  const parseFile = (data) => {
    Papa.parse(
      data,
      {
        header: true,
        complete: (result)=> {
          createColumns(Object.keys(result.data[0]))
          setParsedData(result.data)

          setTimeout(() => {
            setLoading(false)
          }, 2000)
        }
      }
      
    )
  }

  const parseFile2 = (data) => {
    Papa.parse(
      data,
      {
        header: true,
        complete: (result)=> {
          createColumns(Object.keys(result.data[0]))
          setParsedData2(result.data)

          setTimeout(() => {
            setLoading(false)
          }, 2000)
          alert("Carga exitosa")
        }
      }
      
        
    
    )
  }
  
  // let merged = []
  // for(let i=0; i<parseFile.length; i++) {
  //   merged.push({
  //    ...parseFile[i], 
  //    ...(parseFile2.find((itmInner) => itmInner.id === parseFile[i].id))}
  //   );
  // }
  
  // console.log(merged);
  const datita = [...parsedData, ...parsedData2]
  
    const output = []
    
    for(let i = 0; i < parsedData2.length; i++) {
    
    const row = {
    
    name: "",
    
    wtlt_last: 0,
    
    wtlt_curr: 0
    
    }
    
    // const index = array1.findIndex((element)=> array2[i].name === element.name)
    
    // row.name = array2[i].name
    
    // row.amt_last = array1[index].amt
    
    // row.amt_curr = array2[i].amt
    
    // output.push(row)
    
    // }
    
    // console.log(output)

    
    const e1 = output.findIndex((element)=> parsedData2[i].name === element.name)
    const e2 = parsedData.findIndex((element)=> parsedData2[i].name === element.name)
    const index = parsedData.findIndex((element)=> parsedData2[i].name === element.name)

    
    
    if(e1 === -1) {
    row.name = parsedData2[i].name 
    row.wtlt_last = parsedData[e2].wtlt
    row.wtlt_curr = parsedData2[i].wtlt
    
    }
    
    if(index !== -1) {
       row.name_last = parsedData[index].name
    
    }
    
    
  output.push(row)
 }
    
    
    console.log(output)


    // const index = array1.findIndex((element)=> array2[i].name element.name)
    
    // row.name = array2[i].name
    
    // if(index !== -1) { row.amt_last = array1[index].amt
    
    // }
    
    // row.amt_curr = array2[i].amt

  //   datita.forEach((column)=> {

  //   let pruebita = column.WT;
  //   let pruebita2 = column.PA;
  //   console.log(pruebita, pruebita2);   
    
  // });
  
  // datita.forEach((column)=> {

  //   let pruebita = column.PArea;
  //   console.log(pruebita, pruebita2);   
    
  // });
  
  // console.log(parsedData)
  // console.log(parsedData2)
  // console.log(prueba)
  return (
    <div className="App">
      <input type="file" id="file1" name="file1"></input>
      <input type="file" id="file2" name="file2"></input>
      <button className=" bg-orange-2-bph" onClick={readFile}>Cargar</button>
      { loading && <Loader />}
      { !loading && columns.length > 0 && parsedData.length > 0 && <DataTable columns={columns} data={parsedData} pagination /> }
      { !loading && columns.length > 0 && parsedData2.length > 0 && <DataTable columns={columns} data={parsedData2} pagination /> }
    
    </div>
)
}

export default App
