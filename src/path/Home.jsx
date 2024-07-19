import { useEffect, useState } from "react"
import { getDoc,doc ,getDocs, collection, addDoc, updateDoc } from 'firebase/firestore'
import { db } from "../firebase-config"

/* eslint-disable */
const Home = ({data, setData, setInitial}) => {
  const [load, setLoad] = useState(false)

  const getPosts = async () => {
    setLoad(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, data: doc.data() });
      });
      setData(posts);
      setInitial(posts);
    } catch (error) {
      console.error('Error getting documents: ', error);
    }

    setLoad(false)

  };

  const SaveCurrent = async (item) => {
    try {
      const email = localStorage.getItem('email');
      
      const recipeDocRef = doc(db, 'recipes', item.id);
      const recipeDoc = await getDoc(recipeDocRef);

      if (recipeDoc.exists()) {
        const recipeData = recipeDoc.data();
  
        if (recipeData.saved === undefined) {
          // If the 'saved' field does not exist, create it
          await updateDoc(recipeDocRef, {
            saved: [email]
          });
        } else if (!recipeData.saved.includes(email)) {
          // If the 'saved' field exists and does not include the email, update it
          await updateDoc(recipeDocRef, {
            saved: [...recipeData.saved, email]
          });
        } else {
          alert('This recipe is already saved by the user.');
          return;
        }
      }else {
        console.error('No such document!');
      }

      // Save to 'saved' collection
      await addDoc(collection(db, 'saved'), {
        email,
        sendData: item.data.sendData
      });
  
      // Reference to the original recipe document
  
      // Fetch the current recipe document

        getPosts();
    } catch (error) {
      console.error('Error adding or updating document: ', error);
    }
  };


  useEffect(() => {
    getPosts()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="text-white pt-16 flex w-full flex-col justify-center items-center">
      {!localStorage.getItem('uname') ?
        <div className="flex flex-col items-center mt-10">
          <h1 className="text-6xl font-bold max-md:text-2xl">Welcome to the RecipeIt!</h1>
          <p className="text-xl max-md:text-lg mt-7">Please login to view the recipes</p>
        </div>
      :
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
              <h1 className="mb-5 text-2xl font-semibold">{item.data.sendData.title}</h1>
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
                {item.data.sendData.userImage !== localStorage.getItem("img_path") && (
                    <>
                      {item.data.saved && item.data.saved.includes(localStorage.getItem("email")) ? (
                        <button className="mr-2 pointer-events-none">saved</button>
                      ) : (
                        <button className="hover:underline" onClick={() => SaveCurrent(item)}>save</button>
                      )}
                    </>
                  )}
                  <img className="w-10 h-10 mx-2 rounded-full" src={item.data.sendData.userImage} alt="profile" />
                  <p>{item.data.sendData.uname}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>}
    </div>
  )
}

export default Home
