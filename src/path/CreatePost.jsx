import { Description, Field, Fieldset, Input, Label, Select, Textarea } from '@headlessui/react'
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { db } from '../firebase-config'
import { addDoc, collection } from 'firebase/firestore'
import { storage } from '../firebase-config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import { useState } from 'react'

const CreatePost = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        imageData: null,
        ingredients: [],
        category: 'Breakfast recipes',
        instructions: []
    })

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const HandleImageChange = (e) => {
        const file = e.target.files[0]
        setData({
            ...data,
            imageData: file
        })
    }



    const HandleInstructionChange = (e, index) => {
        const newInstructions = data.instructions.map((instruction, i) =>
            i === index ? e.target.value : instruction
        )
        setData({
            ...data,
            instructions: newInstructions
        })
    }
    const HandleIngredientChange = (e, index) => {
        const newIngredients = data.ingredients.map((ingredient, i) =>
            i === index ? e.target.value : ingredient
        )
        setData({
            ...data,
            ingredients: newIngredients
        })
    }
    const AddMoreInstruction = () => {
        setData({
            ...data,
            instructions: [...data.instructions, '']
        })
    }

    const AddMore = () => {
        setData({
            ...data,
            ingredients: [...data.ingredients, '']
        })
    }

    const RemoveIngredient = (index) => {
        const newIngredients = data.ingredients.filter((_, i) => i !== index)
        setData({
            ...data,
            ingredients: newIngredients
        })
    }

    const RemoveInstruction = (index) => {
        const newInstructions = data.instructions.filter((_, i) => i !== index)
        setData({
            ...data,
            instructions: newInstructions
        })
    }


    const getUrl = async (imgRef) => {
        const url = await getDownloadURL(imgRef)
        return url;
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (data.imageData === null) {
            alert('Please upload Image');
            setLoading(false)
            return;
        }

        if (data.ingredients.length === 0) {
            alert('Please add Ingredients');
            setLoading(false)
            return;
        }
        let isIngredientFilled = data.ingredients.every(ingredient => ingredient !== '');
        if (!isIngredientFilled) {
            alert('Please fill all Ingredients');
            setLoading(false)
            return;
        }

        if (data.instructions.length === 0) {
            alert('Please add Instructions');
            setLoading(false)
            return;
        }

        // check if completely ingredients are filled
        let isInstructionFilled = data.instructions.every(instruction => instruction !== '');
        if (!isInstructionFilled) {
            alert('Please fill all Instructions');
            setLoading(false)
            return;
        }
        let imgUrl = null;
        try {
            if (data.imageData !== null) {
                const imgWhole = `images/${data.imageData.name + v4()}`;
                const storageRef = ref(storage, imgWhole);

                // Await the upload process
                await uploadBytes(storageRef, data.imageData);
                console.log('Image Uploaded');

                // Get Image URL
                const imgRef = ref(storage, imgWhole);
                imgUrl = await getUrl(imgRef);
            }

        } catch (error) {
            console.error('Error submitting recipe:', error);
            setLoading(false)
        }

        const sendData = {
            uname: localStorage.getItem('uname'),
            userImage: localStorage.getItem('img_path'),
            image: imgUrl,
            ingredients: data.ingredients,
            category: data.category,
            instructions: data.instructions
        }

        const docRef = await addDoc(collection(db, 'recipes'), {
            sendData
        });

        console.log('Document written with ID: ', docRef.id);
        alert('Recipe Submitted');
        setLoading(false)
    }
    console.log(data);
    return (
        <div className='flex pt-16 justify-center items-center'>
            <div className="w-full max-w-3xl px-4">
                <h1 className="text-3xl font-bold text-white my-5">Write Your Recipe</h1>
                <form onSubmit={HandleSubmit}>
                    <Fieldset className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10" >
                        <Field className='flex justify-center flex-col'>
                            {/* view uploaded Image */}
                            {data.imageData && <img src={URL.createObjectURL(data.imageData)} className="h-96 object-fill rounded-lg mb-3" />}
                            <Label className="text-sm/6 font-medium text-white">Upload Image</Label>
                            <Input
                                type='file'
                                accept='image/svg, image/png, image/jpg, image/jpeg'
                                onChange={HandleImageChange}
                                className={clsx(
                                    'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                )}
                            />
                        </Field>
                        <Field>
                            <Label className="text-sm/6 font-medium text-white">Ingredients</Label>
                            <Description className="text-sm/6 text-white/50">Write the Ingredient Used to make this recipe</Description>
                            <div id='ingredient'>
                                {/* Add delete button in right side in each ingedient Input */}
                                {data.ingredients.map((ingredient, index) => (
                                    <div key={index} className="relative mt-3">
                                        <input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => HandleIngredientChange(e, index)}
                                            className={clsx(
                                                'block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                            )}
                                            name={`ingredient-${index}`}
                                            id={`ingredient-${index}`}
                                        />
                                        <TrashIcon
                                            className="group cursor-pointer absolute top-2.5 right-2.5 h-5 w-5 fill-white/60 hover:fill-red-500"
                                            title='delete'
                                            onClick={() => RemoveIngredient(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={clsx(
                                'mt-3 flex items-center justify-center cursor-pointer select-none w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                            )} onClick={AddMore}>Add Ingredient</div>
                        </Field>
                        <Field>
                            <Label className="text-sm/6 font-medium text-white">Category</Label>
                            <Description className="text-sm/6 text-white/50">Write the Category of this Recipe</Description>
                            <div className="relative">
                                <Select
                                    name='category'
                                    id='category'
                                    onChange={handleChange}
                                    className={clsx(
                                        'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                                        // Make the text of each option black on Windows
                                        '*:text-black'
                                    )}
                                >
                                    <option value="Breakfast recipes">Breakfast recipes</option>
                                    <option value="Lunch recipes">Lunch recipes</option>
                                    <option value="Dinner recipes">Dinner recipes</option>
                                    <option value="Snacks recipes">Snacks recipes</option>
                                    <option value="Desserts recipes">Desserts recipes</option>
                                    <option value="Drinks recipes">Drinks recipes</option>
                                    <option value="Appetizer recipes">Appetizer recipes</option>
                                    <option value="Salad recipes">Salad recipes</option>
                                    <option value="Soup recipes">Soup recipes</option >
                                    <option value="Main-course recipes">Main-course recipes</option>
                                    <option value="Side-dish recipes">Side-dish recipes</option>
                                    <option value="Vegetarian Dishes">Vegetarian Dishes</option>
                                    <option value="Non-vegetarian Dishes">Non-vegetarian Dishes</option>
                                    <option value="Vegan Dishes">Vegan Dishes</option>
                                </Select>
                                <ChevronDownIcon
                                    className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                    aria-hidden="true"
                                />
                            </div>
                        </Field>
                        <Field>
                            <Label className="text-sm/6 font-medium text-white">Instructions</Label>
                            <Description className="text-sm/6 text-white/50">
                                Write the Instruction to make this Recipe, Press <span className='text-white'>Enter</span> to add <span className='text-white'>New</span> step
                            </Description>

                            <div id="Instructions">
                                {data.instructions.map((instruction, index) => (
                                    <div key={index} className="relative mt-3">
                                        <Textarea
                                            value={instruction}
                                            onChange={(e) => HandleInstructionChange(e, index)}
                                            className={clsx(
                                                'block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                            )}
                                            name={`instruction-${index}`}
                                            id={`instruction-${index}`}
                                        />
                                        <TrashIcon
                                            className="group cursor-pointer absolute top-2.5 right-2.5 h-5 w-5 fill-white/60 hover:fill-red-500"
                                            title='delete'
                                            onClick={() => RemoveInstruction(index)}
                                        />
                                    </div>
                                ))}
                                <div className={clsx(
                                    'mt-3 flex items-center justify-center cursor-pointer select-none w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                )} onClick={AddMoreInstruction}>Add Instruction</div>
                            </div>
                        </Field>
                        <button type="submit" className={clsx(
                            'flex items-center justify-center mt-3 w-full rounded-lg border-none bg-white/25 text-white py-2.5 px-5 me-2 text-sm font-medium',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}>
                            {loading && <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#000" />
                            </svg>}
                            Submit</button>
                    </Fieldset>
                </form>
            </div>
        </div>
    )
}


export default CreatePost
