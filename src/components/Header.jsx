import React from 'react'
import spaceX from '../assets/space-x.png'

const Header = () => {
    return (
        <div className="flex justify-center items-center">
            <img
                src={spaceX}
                alt="SpaceX"
                className="h-20 w-auto"
            />
        </div>
    )
}

export default Header