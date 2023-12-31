import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode';
import remove from '../icons/remove.png'
import noprofile from '../icons/noprofile.png'
import { useDispatch, useSelector } from 'react-redux';
import { SideBarSlice } from '../features/UserSlice';
import { base } from '../services/Axios';
function Sidebar() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar 
    const toggleSidebar = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false)
        } else {
            setIsSidebarOpen(true)
        }
    };

    const dispatch = useDispatch()
    const user = useSelector((state) => (state.Users))
    const [socket, setSocket] = useState()
    const [socket1, setSocket1] = useState()
    const [count, setCount] = useState(0)
    const [selected, setSelected] = useState(false)


    //for loggin out
    let navigate = useNavigate()

    let logout = async (e) => {
        await localStorage.removeItem('authToken')
        console.log("Removed the authtoken")
        navigate('/login')
    }

    //conditional rendering for the side bar
    let token = localStorage.getItem("authToken")
    let decode = jwtDecode(token)

    useEffect(() => {
        dispatch(SideBarSlice(decode.user_id))
    }, [])

    useEffect(() => {
        let credential = decode.is_user && decode.is_advisor ? `36_2` : (decode.is_user && decode.is_reviewer ? `36_3` : `36_1`)
        const createSocket = async () => {
            console.log(decode)
            try {
                const request = await new WebSocket(`${base}/ws/notification/${credential}/`)
                await setSocket(request)
                console.log("This connection is made from the sidebar")

            } catch (error) {
                console.log("Error: ", error)
            }
        }
        createSocket()
    }, [])


    useEffect(() => {
        let credential = '36_123'
        const createSocket = async () => {
            console.log(decode)
            try {
                const request = await new WebSocket(`${base}/ws/notification/${credential}/`)
                await setSocket1(request)
                console.log("This connection is made from the sidebar1")

            } catch (error) {
                console.log("Error: ", error)
            }
        }
        createSocket()
    }, [])


    useEffect(() => {
        if (socket) {

            socket.onmessage = async (event) => {
                const message = await JSON.parse(event.data);
                console.log("This is the message: ", message)
                if (!selected) {
                    setCount(prevCount => prevCount + 1);
                }
            };
        }
        if (socket1) {

            socket.onmessage = async (event) => {
                const message = await JSON.parse(event.data);
                console.log("This is the message: ", message)
                if (!selected) {
                    setCount(prevCount => prevCount + 1);
                }
            };
            socket1.onmessage = async (event) => {
                const message = await JSON.parse(event.data);
                console.log("This is the message: ", message)
                if (!selected) {
                    setCount(prevCount => prevCount + 1);
                }
            };
        }
    }, [socket, socket1, selected]);


    return (
        <div className=''>
            <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                </svg>
            </button>


            <aside
                id="default-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? '' : '-translate-x-full lg:translate-x-0'
                    }`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-[#191C24]">
                    <div className='flex items-center absolute justify-end'>
                        <img className='h-6 z-50 lg:hidden cursor-pointer relative left-[200px]' onClick={(e) => setIsSidebarOpen(false)} src={remove} alt="" />
                    </div>
                    <ul className="space-y-2 ms-5 mt-5 text-lg">

                        {
                            user.sidebar ?
                                <>
                                    <li className='mb-8'>
                                        <span className='flex items-center justify-start max-w-[180px] p-2 opacity-70 rounded-2xl bg-[#272d43]'>
                                            <img className='h-12 rounded-full w-12 object-cover' src={user.sidebar.image ? user.sidebar.image : noprofile} alt="" />
                                            <p className='text-white text-xl ms-4 truncate'>{(decode.username).toUpperCase()}</p>
                                        </span>
                                    </li>
                                </> : null
                        }

                        <li onClick={(e) => setSelected(false)}>
                            <Link to='/'>
                                <span href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                    <span className="ml-3 ">Profile</span>
                                </span>
                            </Link>
                        </li>
                        {
                            decode.is_superuser ?
                                <li>
                                    <Link to='/dashboard'>
                                        <span href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-collection" viewBox="0 0 16 16">
                                                <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0
                                             1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5
                                             1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 
                                            .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z" /> </svg>
                                            <span className="ml-3 ">Admin Dashboard</span>
                                        </span>
                                    </Link>
                                </li> : null
                        }
                        {
                            decode.is_superuser ?
                                <li>
                                    <Link to='/authorize'>
                                        <span href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /> </svg>
                                            <span className="ml-3 ">Authorize Users</span>
                                        </span>
                                    </Link>
                                </li> : null
                        }
                        {
                            decode.authenticated ?
                                <li onClick={(e) => setSelected(false)}>
                                    <Link to='/chat'>
                                        <span href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                            </svg>
                                            <span className="flex-1 ml-3 whitespace-nowrap">Chats</span>
                                        </span>
                                    </Link>
                                </li>
                                :
                                null
                        }
                        {
                            decode.is_advisor && decode.authenticated ?
                                <li onClick={(e) => setSelected(false)}>
                                    <Link to='/schedule_time'>
                                        <span href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z" />
                                                <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z" />
                                            </svg>
                                            <span className="flex-1 ml-3 whitespace-nowrap">Schedule Time</span>
                                        </span>
                                    </Link>
                                </li> : null
                        }
                        {
                            decode.is_reviewer && decode.authenticated ?
                                <li onClick={(e) => setSelected(false)}>
                                    <Link to='/assign_time'>
                                        <span href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z" />
                                                <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z" />
                                            </svg>
                                            <span className="flex-1 ml-3 whitespace-nowrap">Assign My Time</span>
                                        </span>
                                    </Link>
                                </li> : null
                        }


                        {
                            decode.is_user && !decode.is_superuser && !decode.is_reviewer && !decode.is_advisor && decode.authenticated ?
                                <li onClick={(e) => setSelected(false)}>
                                    <Link to='/weeks'>
                                        <span className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white  dark:hover:bg-gray-700 group">
                                            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                            </svg>
                                            <span className="flex-1 ml-3 whitespace-nowrap">Weeks</span>

                                        </span>
                                    </Link>
                                </li> : null
                        }
                        <li onClick={(e) => {
                            setSelected(true)
                            setCount(0)
                        }}>
                            <Link to='/notification'>
                                <span href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    {
                                        decode.is_superuser ? <span className="flex-1 ml-3 whitespace-nowrap">Send Notifications</span> : <span className="flex-1 ml-3 whitespace-nowrap">Notifications</span>
                                    }
                                    {!decode.is_superuser ? <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{!decode.is_superuser ? (user.sidebar.notification_count >= count ? user.sidebar.notification_count : count) : null}</span> : null}
                                </span>
                            </Link>
                        </li>

                        <li className='cursor-pointer' onClick={(e) => {
                            return logout()
                        }}>
                            <span className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Log Out</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    )
}

export default Sidebar
