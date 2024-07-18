import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from 'firebase/firestore';
import {db} from '../firebase-config'


const Saved = () => {
    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)

    const getSaved = async () => {
        setLoad(true)
        const email = localStorage.getItem('email');
        const q = query(collection(db, 'saved'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const saved = [];
        querySnapshot.forEach((doc) => {
            saved.push({ id: doc.id, data: doc.data() });
        });
        setData(saved);

        setLoad(false)
    }


    useEffect(() => {
        getSaved()
    }, [])

  return (
    <div className="text-white pt-16 flex w-full flex-col justify-center items-center">
        <h1 className="text-center max-md:text-xl max-md:my-5 text-3xl font-bold my-10 ">My Favourite Recipes</h1>
        {data.length === 0 && <h1 className="flex my-10">No Favourite Recipes</h1>}
        <div className="w-full flex flex-col max-w-xl">
        {load && <div className="flex items-center justify-center mt-10">
              <div className="relative">
                  <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                  <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                  </div>
              </div>
        </div>}
        {data.map((item) => {
          return (
            <div key={item.id} className={`border-2 w-full p-4 mb-2 rounded-lg`}>
              <img src={item.data.sendData.image} className="rounded-lg w-full h-64 object-fill" alt="image" />
              <div className="mt-2 w-full">
                <h1 className="text-transparent bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-2xl font-bold">Ingredients </h1>
                <ul className="flex flex-col text-justify ml-10">
                  {item.data.sendData.ingredients.map((ing, index) => {
                    return (
                      <li key={index} className="mt-1 list-disc">{ing}</li>
                    )
                  })}
                </ul>
              </div>
              <div className="mt-2 w-full">
                <h1 className="text-transparent bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-2xl font-bold">Instructions </h1>
                <ul className="flex flex-col text-justify ml-10">
                  {item.data.sendData.instructions.map((ins, index) => {
                    return (
                      <li key={index} className="mt-1 list-decimal">{ins}</li>
                    )
                  })}
                </ul>
              </div>
              <div className="w-full flex justify-between items-center mt-8 py-2 border-y-2">
                <h1 className="text-lg font-semibold">{item.data.sendData.category}</h1>
                <div className="flex items-center"> 
                  <img className="w-10 h-10 mx-2 rounded-full" src={item.data.sendData.userImage} alt="profile" />
                  <p>{item.data.sendData.uname}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Saved
