import React, { useState, useEffect } from "react"

import Papa, { parse } from "papaparse"
import * as XLSX from "xlsx"


const Loader = () => {
  return (
    <div>
      <h3>Cargando BHP Payroll...</h3>
    </div>
  )
}

const TablaBhp = () => {




  const [parsedData, setParsedData] = useState([])
  const [columns, setColumns] = useState([])
  // const [selectedColumns, setSelectedColumns] = useState([])
  const [loading, setLoading] = useState(false)

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")


  const readUrl = (url) => {

    setLoading(true)
    parseFile2(url)


  }

  const readFile = (file1) => {

   
  

    setLoading(true)
  

    const reader = new FileReader()

    reader.onload = (evt) => {
      const bstr = evt.target.result
      const wb = XLSX.read(bstr, { type: "binary" })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 })
      parseFile(data)

      // console.log(data)
    }
    reader.readAsBinaryString(file1)

    
  }

  const createColumns = (data) => {
    const columns = []
    data.forEach((item) => {
      columns.push({
        name: item,
        selector: row => row[item],
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
        complete: (result) => {
          createColumns(Object.keys(result.data[0]))
          setParsedData(result.data)

          setTimeout(() => {
            setLoading(false)
          }, 2000)
          alert("Carga exitosa")

        }
      }

    )

  }

  const parseFile2 = (url) => {
    Papa.parse(
      url,
      {
        download: true,
        complete: (result) => {
          result.data.splice(0,2)
          // createColumns(Object.keys(result.data[0]))
          setParsedData(result.data)
          console.log(result.data)

          setTimeout(() => {
            setLoading(false)
          }, 2000)
          alert("Carga exitosa")
        }
      }



    )
  }

  const loadButton = () =>{
    const url = document.getElementById("file2").value
    const e = document.getElementById("file1")
    const [file1] = e.files
    if (!file1 && url) {
      readUrl(url)
      // return
    }else{
      readFile(file1)
    }


    
  }

  const columnsData = [...parsedData]


  const showData = async () => {
    const response = await fetch(columnsData)
    // const data = await response.columnsData

    // setUsers(data)
  }

  // showData()
  const searcher = (e) => {
    setSearch(e.target.value)
    console.log(e.target.value)
  }

  //metodo de filtrado

  const calculateDiff = (num1, num2)=> {
    return Number(num1.replace(/,/g, "")) - Number(num2.replace(/,/g, ""))
  }

  let results = [...parsedData]
  let diffs = []
  const countDiffs = (data)=> {
    let count = 0
    data.forEach((item)=> {
      const diff = calculateDiff(item.current, item.past)
      if(diff != 0) {
        count += 1
      }
    })

    return count
  }
  

  if (!search) {
    // results = columnsData
   console.log("nope")
  } else {
    results = columnsData.filter((dato) =>
      dato.name.toLowerCase().includes(search.toLocaleLowerCase())
      
    )
  }

  console.log(results)

  

  useEffect(() => {
    showData()
  }, [])



  return (
    <>

      <main>
        

        <div className="container flex flex-col text-center">
          <div className="flex flex-col items-center">
        <section  className="flex flex-row items-center p-5 content-center space-x-4 rounded-md bg-white/80 m-5">         
        <input type="file" id="file1" name="file1" className=""></input>
        <input type="url" id="file2" name="file2" placeholder="Pega la URL"></input>
        <button id="upload" className=" bg-orange-2-bph text-white hover:bg-orange-1-bph transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 ..." onClick={loadButton}>CARGAR</button>          
        {loading && <Loader />}
          
          </section>
          </div>
          <div className="flex flex-col items-center">
          <section className="h-20 w-4/6 p-5 rounded-lg bg-white/80 text-orange-1-bph font-bold">
         <p className="">Discrepancias: {countDiffs(results)} - ({(countDiffs(results) * 100 / results.length).toFixed(2)}%)</p>
          <p>Datos cargados: {results.length}</p>
          </section>
          </div>

          <section className=" tablita flex flex-col items-center bg-white/50 overflow-y-scroll mt-10">
          <input value={search} onChange={searcher} type="text" placeholder='Buscar por dato' className='form-control mt-10 rounded-md h-7 w-15 text-center' />
          
            <table className=" bhpTabla w-10/12 m-5 mt-10 text-sm text-center shadow-2xl font-[Arial] rounded-lg">
              <thead className=" h-16 text-sm text-white uppercase bg-blue-grey-2-bph ">
                <tr className="  ">
                  <th>Id Employee</th>
                  <th>Name</th>
                  <th>Wage Type</th>
                  <th>Wage Type Long Text</th>
                  <th>Past</th>
                  <th>Current</th>
                  <th>Difference</th>
                </tr>
              </thead>

              <tbody className="w-full mx-5">
                {results.map((column) => (
                  //key={`${element.name}${element.key}`}
                  <tr className=" bg-white hover:bg-blue-grey-3-bph hover:scale-105 hover:text-white cursor-pointer duration-200">
                    <td>{column.id}</td>
                    <td>{column.name}</td>
                    <td>{column.wt} </td>
                    <td>{column.wtlt} </td>
                    <td className={ 
                      calculateDiff(column.current, column.past) < 0 ? "bg-orange-3-bph/50 hover:bg-orange-3-bph " :
                      calculateDiff(column.current, column.past) > 0 ? " bg-green-bph/50 hover:text-white  hover:bg-green-bph" :
 calculateDiff(column.current, column.past) == 0 && column.current && column.past ? " bg-blue-bph/50 hover:text-white hover:bg-blue-bph" :
                      "" 
                    }>
                      {!column.past ? "---" : column.past.replace(/,/g, ".")}
                    </td>
                    <td className={ 
                      calculateDiff(column.current, column.past) < 0 ? "bg-orange-3-bph/50 hover:bg-orange-3-bph" :
                      calculateDiff(column.current, column.past) > 0 ? " bg-green-bph/50 hover:text-white  hover:bg-green-bph" :
                      calculateDiff(column.current, column.past) == 0 && column.current && column.past ? " bg-blue-bph/50 hover:text-white hover:bg-blue-bph" :
                      "" 
                    }>
                      {!column.current ? "---" : column.current.replace(/,/g, ".")}
                    </td>
                    <td className={ 
                      calculateDiff(column.current, column.past) < 0 ? "bg-orange-3-bph/50  hover:bg-orange-3-bph" :
                      calculateDiff(column.current, column.past) > 0 ? "bg-green-bph/50 hover:text-white  hover:bg-green-bph" :
                      calculateDiff(column.current, column.past) == 0 && column.current && column.past ? " bg-blue-bph/50 hover:text-white hover:bg-blue-bph" :
                      "" 
                    }>
                      { !column.past || !column.current ? "---" : calculateDiff(column.current, column.past).toLocaleString()}
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>
            <button id="upload" className=" mb-10 bg-orange-2-bph text-white hover:bg-orange-1-bph transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 ...">DESCARGAR</button>
            

          </section>
        </div>
      </main>
    </>
  );

}


export default TablaBhp