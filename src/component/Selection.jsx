import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../store/appContext";
import styles from "../styles/selection.css";
import MyCheckbox from './MyCheckbox';

const Selection = (props) => {
const { store, actions } = useContext(Context);
const categoryIds = ["food", "health", "shelter", "hygiene", "crisis", "substance", "work", "bathroom", "wifi", "mental", "sex", "legal"];
const groupIds = ["lgbtq", "women", "seniors", "youth"];
const dayIds = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];


const [showCategories, setShowCategories] = useState(false);
const [showGroups, setShowGroups] = useState(false);
const [showDays, setShowDays] = useState(false);



const renderCenterColumn = (type, state, setState) => {
    const ids = type === 'category' ? categoryIds : (type === 'group' ? groupIds : dayIds);
    const options = type === 'category' ? store.CATEGORY_OPTIONS : (type === 'group' ? store.GROUP_OPTIONS : store.DAY_OPTIONS);
  
    return (
        <div className="center">
            {ids.map(id => {
                const option = options.find(o => o.id === id);
                return option ? (
                    <MyCheckbox
                        key={id}
                        id={id}
                        label={option.label}
                        isChecked={state[id]}
                        handleToggle={() => handleToggle(setState, state, id)}
                    />
                ) : null;
            })}
        </div>
    );
};

    const handleToggle = (setFn, stateObj, id) => {
        setFn({
            ...stateObj,
            [id]: !stateObj[id],
        });
    };

    useEffect(() => {
        console.log("Categories", props.categories);
        console.log("Days", props.days);
        console.log("Groups", props.groups);
    }, [props.categories, props.days, props.groups]);

    return (
        <div className="selection">
            <div className='cent'>
            <button onClick={() => setShowCategories(!showCategories)} className={showCategories ? "open2" : "closed2"}>
                {showCategories ? "X" : 'Filter By Category'}
            </button>
            {showCategories && renderCenterColumn('category', props.categories, props.setCategories)}
            </div>
            <div className='cent'>
            <button onClick={() => setShowGroups(!showGroups)} className={showGroups ? "open2" : "closed2"}>
                {showGroups ? "X": 'Filter By Group'}
            </button>
            {showGroups && renderCenterColumn('group', props.groups, props.setGroups)}
            </div>
            <div className='cent'>
            <button onClick={() => setShowDays(!showDays)} className={showDays ? "open2" : "closed2"}>
                {showDays ? "X" : 'Filter By Day'}
            </button>
            {showDays && renderCenterColumn('day', props.days, props.setDays)}
            </div>
        </div>
    );
    
};

export default Selection;






// import React, { useContext } from 'react';
// import { Context } from "../store/appContext";
// import styles from "../styles/selection.css"

// const Selection = ({
//     categories,
//     days,
//     groups,
//     setIsOpen,
//     allCategories,
//     allGroups,
//     allDays,
//     handleAllCategories,
//     handleAllGroups,
//     handleAllDays,
//     filterByCategory,
//     filterByGroup,
//     setFilterByGroup,
//     handleEvent,
//     setFilterByCategory,
//     setFilterByDay,
//     filterByDay,
//     handleToggle,
//     setCategories
// }) => {
//     const { store, actions } = useContext(Context);
//     console.log("STORE CATEGORY_OPTIONS:", store.CATEGORY_OPTIONS); // Debug point
//     console.log("STORE DAY_OPTIONS:", store.DAY_OPTIONS); // Debug point
//     console.log("STORE GROUP_OPTIONS:", store.GROUP_OPTIONS); // Debug point
//     console.log("Context Store:", store);  // Debug point 1
//     console.log("Props:", { categories, groups, days, allCategories, allGroups, allDays, filterByCategory, filterByGroup, filterByDay });  // Debug point 2

//     const categoryIds = ["food", "health", "shelter", "hygiene", "crisis", "substance", "work", "bathroom", "wifi", "mental", "sex", "legal"];
//     const groupIds = ["lgbtq", "women", "seniors", "youth"];
//     const dayIds = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
//     import React, { useContext } from 'react';
//     import { Context } from "../store/appContext";
//     import styles from "../styles/selection.css"

//     const Selection = ({
//         categories,
//         days,
//         groups,
//         setIsOpen,
//         allCategories,
//         allGroups,
//         allDays,
//         handleAllCategories,
//         handleAllGroups,
//         handleAllDays,
//         filterByCategory,
//         filterByGroup,
//         setFilterByGroup,
//         handleEvent,
//         setFilterByCategory,
//         setFilterByDay,
//         filterByDay,
//         handleToggle,
//         setCategories
//     }) => {
//         const { store, actions } = useContext(Context);
//         console.log("STORE CATEGORY_OPTIONS:", store.CATEGORY_OPTIONS); // Debug point
//         console.log("STORE DAY_OPTIONS:", store.DAY_OPTIONS); // Debug point
//         console.log("STORE GROUP_OPTIONS:", store.GROUP_OPTIONS); // Debug point
//         console.log("Context Store:", store);  // Debug point 1
//         console.log("Props:", { categories, groups, days, allCategories, allGroups, allDays, filterByCategory, filterByGroup, filterByDay });  // Debug point 2

//         const categoryIds = ["food", "health", "shelter", "hygiene", "crisis", "substance", "work", "bathroom", "wifi", "mental", "sex", "legal"];
//         const groupIds = ["lgbtq", "women", "seniors", "youth"];
//         const dayIds = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

//         {
//             optionIds.map(optionId => {
//                 let option;
//                 if (resourceFlag === "category") {
//                     option = store.CATEGORY_OPTIONS?.find(o => o.id === optionId);
//                 } else if (resourceFlag === "day") {
//                     option = store.DAY_OPTIONS?.find(o => o.id === optionId);
//                 } else if (resourceFlag === "group") {
//                     option = store.GROUP_OPTIONS?.find(o => o.id === optionId);
//                 }
//                 return option ? (
//                     <div className="day-row" key={option.id}>
//                         <div className="my-form-check">
//                             <input
//                                 className="my-input"
//                                 type="checkbox"
//                                 id={option.id}
//                                 value={option.id}
//                                 name="selection"
//                                 checked={stateObj[option.id]} // change here to be dynamic
//                                 onChange={() => handleToggle(setFn, stateObj, option.id)} // change here to be dynamic
//                             />
//                             <label className="my-label" htmlFor={option.id}>{option.label}</label>
//                         </div>
//                     </div>
//                 ) : null;
//             })
//         }
//       return (
//         <div className="selection">
//           {renderCenterColumn(filterByCategory, setFilterByCategory, allCategories, categoryIds, handleAllCategories, "category", "Filter By Category", categories, setCategories)}
//           {renderCenterColumn(filterByGroup, setFilterByGroup, allGroups, groupIds, handleAllGroups, "group", "Filter by Demographic", groups, setGroups)}
//           {renderCenterColumn(filterByDay, setFilterByDay, allDays, dayIds, handleAllDays, "day", "Filter By Day", days, setDays)}
//         </div>
//       );
      
//       }
//     }; export default Selection;
      
      


// // const renderCenterColumn = (isOpen, setIsOpen, allValue, optionIds, handleAll, resourceFlag, buttonText = "Filter", stateObj, setFn) => (
// //     <div className="center">
// //         {setIsOpen(true)}

// //         {console.log("Render center column: ", { isOpen, allValue, optionIds, resourceFlag })}
// //         {isOpen &&
// //             <div className="more-open-ids">

// //                 <div className="day-row">
// //                     <div className="my-form-check">
// //                         <input
// //                             className="my-input"
// //                             type="checkbox"
// //                             id={allValue}
// //                             value={allValue}
// //                             name="selection"
// //                             checked={allValue}
// //                             onChange={() => handleAll && handleAll()}
// //                         />
// //                         <label className="my-label" htmlFor={allValue}>All</label>
// //                     </div>
// //                 </div>
// //                 {optionIds.map(optionId => {
// //                     let option;
// //                     if (resourceFlag === "category") {
// //                         option = store.CATEGORY_OPTIONS?.find(o => o.id === optionId);
// //                     } else if (resourceFlag === "day") {
// //                         option = store.DAY_OPTIONS?.find(o => o.id === optionId);
// //                     } else if (resourceFlag === "group") {
// //                         option = store.GROUP_OPTIONS?.find(o => o.id === optionId);
// //                     }
// //                     return option ? (
// //                         <div className="day-row" key={option.id}>
// //                           <div className="my-form-check">
// //                             <input
// //                               className="my-input"
// //                               type="checkbox"
// //                               id={option.id}
// //                               value={option.id}
// //                               name="selection"
// //                               checked={stateObj[option.id]} // change here to be dynamic
// //                               onChange={() => handleToggle(setFn, stateObj, option.id)} // change here to be dynamic
// //                             />
// //                             <label className="my-label" htmlFor={option.id}>{option.label}</label>
// //                           </div>
// //                         </div>
// //                       ) : null;
// //                     })}
// //                   </div>
// //                 );

// return (
//     <div className="selection">
//         {renderCenterColumn(filterByCategory, setFilterByCategory, allCategories, categoryIds, handleAllCategories, "category", "Filter By Category", categories, setCategories)}
//         {renderCenterColumn(filterByGroup, setFilterByGroup, allGroups, groupIds, handleAllGroups, "group", "Filter by Demographic", groups, setGroups)}
//         {renderCenterColumn(filterByDay, setFilterByDay, allDays, dayIds, handleAllDays, "day", "Filter By Day", days, setDays)}
//     </div>
// );
// }; export default Selection;