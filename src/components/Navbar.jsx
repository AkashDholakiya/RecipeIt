import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import {auth, provider } from '../firebase-config'
import { Link } from 'react-router-dom'


const navigation = [
  { name: 'Dashboard', href: '/', current: true }
]

const handleLogout = () => {
  signOut(auth).then(() => {
    localStorage.clear()
    window.location.reload()
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
    console.log(user) 
  }
)
}
const user = {
  name: localStorage.getItem('uname'),
  email: localStorage.getItem('email'),
  imageUrl: localStorage.getItem('img_path'),
}
console.log(user)
const Navbar = () => {
  const [active, setActive] = useState(false)

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800 fixed w-full shadow-white shadow-sm">
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
                        onClick={() => {setActive(false); item.current = true;}}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {localStorage.getItem('role') === 'doctor' && <Link
                        to="/mypost"
                        onClick={() => {setActive(true); navigation[0].current = false;}}
                        aria-current={active ? 'page' : undefined}
                        className={classNames(
                          active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        Post
                      </Link>}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {localStorage.getItem('email') && <button 
                          className={classNames('bg-gray-900 px-3 py-2 rounded-lg mx-5 text-white hover:text-white'
                          )}
                        >
                          Create Post
                  </button>}
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                  </button>

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
                  onClick={() => {setActive(false); item.current = true;}}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {localStorage.getItem('role') === 'doctor' && <Link
                to="/createblog"
                onClick={() => {setActive(true); navigation[0].current = false;}}
                aria-current={active ? 'page' : undefined}
                className={classNames(
                  active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium',
                )}
              >
                Post
              </Link>}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              {localStorage.getItem("id") ?  <div>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img alt="image" src={user.imageUrl} className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                    {/* <Link
                      to='/profile'
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      profile
                    </Link> */}
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
