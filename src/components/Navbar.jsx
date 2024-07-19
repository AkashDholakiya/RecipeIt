import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BookmarkIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {  Field, Input, Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {clsx} from 'clsx'
import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { auth, provider } from '../firebase-config'
import { Link } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', href: '/'}
]

const handleLogout = () => {
  signOut(auth).then(() => {
    localStorage.clear()
    window.location.pathname = '/'
  }).catch((error) => {
    console.log(error)
  })
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const handleSignup = () => {
  signInWithPopup(auth, provider)
  .then((result) => {
    const user = result.user
    localStorage.setItem('id', user.uid)
    localStorage.setItem('uname', user.displayName)
    localStorage.setItem('email', user.email)
    localStorage.setItem('img_path', user.photoURL)
    window.location.reload()
  }
)
}
const user = {
  name: localStorage.getItem('uname'),
  email: localStorage.getItem('email'),
  imageUrl: localStorage.getItem('img_path'),
}

/* eslint-disable */
const Navbar = ({data, setData, initial}) => {
  const [search, setSearch] = useState('')
  const [filter , setFilter] = useState('filter')

  const handleChange = (e) => {
    setSearch(e.target.value)

    if(e.target.value === '') {
      setData(initial)
    }
  }

  const handleFilter = (e) => {
    setFilter(e.target.value)

    if(e.target.value === 'filter') {
      setData(initial)
      return;
    }

    const filterRecipe = initial.filter((recipe) => {
      return recipe.data.sendData.category === e.target.value
    })
    setData(filterRecipe)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(search === '') {
      return
    }

    const searchRecipe = data.filter((recipe) => {
      // for each ingredient in the recipe, check if the search value is included
      return recipe.data.sendData.ingredients.some((ingredient) => ingredient.toLowerCase().includes(search.toLowerCase()))
    })
    setData(searchRecipe)

  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="backdrop-blur fixed w-full z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Link className='text-transparent cursor-pointer bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-2xl font-extrabold' to='/'>RecipeIt</Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          'bg-gray-900 text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {localStorage.getItem('email') && <Field>
                        <div className="relative">
                            <Select
                                name='filter'
                                id='filter'
                                value={filter}
                                onChange={handleFilter}
                                className={clsx(
                                    'block appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                                    // Make the text of each option black on Windows
                                    '*:text-black'
                                )}
                            >
                                <option value="filter">Filter</option>
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
                    </Field>}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {localStorage.getItem('email') && 
                  <>
                  <div className="relative w-64">
                    <Input type="text"
                          value={search}
                          onChange={handleChange}
                          className={clsx(
                              'w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white flex-grow',
                              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                          )}
                          placeholder='Search Recipe by ingredient'
                          name={`search`}
                          id={`search`} 
                    />
                    <div className="absolute inset-y-0 right-0 w-8 flex items-center">
                      <MagnifyingGlassIcon
                        className="group cursor-pointer h-5 w-5 fill-white/60 hover:fill-white/80"
                        title='search'
                        onClick={handleSubmit}
                      />
                    </div>
                  </div>
                  <Link 
                    className={classNames('bg-gray-900 px-3 py-2 rounded-lg mx-5 text-white hover:text-white'
                    )}
                    to='/createpost'>
                          Create Post
                  </Link>
                  <Link
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    to='/myfavourite'
                  >
                    {/* <span className="absolute -inset-1.5" /> */}
                    <span className="sr-only">View notifications</span>
                    <BookmarkIcon aria-hidden="true" className="h-6 w-6" />
                  </Link>
                  </>}

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      {localStorage.getItem('id') ? <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <img alt="prof" src={user.imageUrl} className="h-8 w-8 rounded-full" />
                      </MenuButton>
                       : <Link className="text-white hover:underline" onClick={handleSignup}>Signup</Link>}
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                        {/* <MenuItem>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                          >
                            profile
                          </Link>
                        </MenuItem> */}
                        <MenuItem>
                          <Link
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                          >
                            logout
                          </Link>
                        </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Link 
                  key={item.name}
                  to={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              {localStorage.getItem("id") ?  
                <div>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img alt="image" src={user.imageUrl} className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                  </div>
                  <Link
                    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    to='/myfavourite'
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BookmarkIcon aria-hidden="true" className="h-6 w-6" />
                  </Link>
                </div>
                <div className="mt-3 space-y-1 px-2">
                    {/* <Link
                      to='/profile'
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      profile
                    </Link> */}
                    {localStorage.getItem('email') && <Link 
                          className={"block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"}
                        to='/createpost'>
                          Create Post
                    </Link>}
                    <button
                      onClick={handleLogout}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      logout
                    </button>
                </div>
              </div> : <Link className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white" onClick={handleSignup}>Signup</Link>}
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  )
}

export default Navbar
