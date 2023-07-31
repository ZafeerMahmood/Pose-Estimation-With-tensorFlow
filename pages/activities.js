// import React from 'react'
// import Sidebar from '../components/sidebar'
// import List from '../components/list'

// function Activities() {

//     const data = [{ heading: 'heading 1', subheading: 'subheading 1', link: 'link 1', distance: 'distance 1' },
//     { heading: 'heading 1', subheading: 'subheading 1', link: 'link 1', distance: 'distance 1' },
//     { heading: 'heading 1', subheading: 'subheading 1', link: 'link 1', distance: 'distance 1' },]
//     return (

//         <div className='h-screen w-screen'>
//             <Sidebar />
//             <div className='h-full w-full flex flex-col justify-start items-center space-y-4'>
//                 <h4 className="  text-3xl md:text-5xl font-extrabold dark:text-black mb-6 "> List of Activites</h4>
//                 {data.map((item,index) => {
//                     return (
//                         <div key={index}>
//                             <List heading={item.heading} subheading={item.subheading} link={item.link} distance={item.distance} className />
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// }

// export default Activities