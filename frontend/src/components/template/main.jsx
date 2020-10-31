import React from 'react'
import './main.css'

import Header from './header'

export default props =>
    <React.Fragment>
        <Header {...props}/>
        <main className="content">
            <div className="p-3 mt-3">
                {props.children}
            </div>
        </main>
    </React.Fragment>