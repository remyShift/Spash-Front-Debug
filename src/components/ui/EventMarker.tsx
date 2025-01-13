import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function EventMarker() {
    return (
        <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
    )
}