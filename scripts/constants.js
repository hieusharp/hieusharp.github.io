
import {LinearEncoding,sRGBEncoding, BasicDepthPacking,RGBADepthPacking } from './js/three.module.js'; 

const encodings = [
    {
        "text": "LinearEncoding",
        "value": LinearEncoding
    },
        {
        "text": "sRGBEncoding",
        "value": sRGBEncoding,
        "selected": true
    },
    {
        "text": "BasicDepthPacking",
        "value": BasicDepthPacking
    },
    {
        "text": "RGBADepthPacking",
        "value": RGBADepthPacking
    },
]



const environments = [
    {
        "text": "Station Night",
        "value": "dresden_station_night_1k.hdr"
    },
        {
        "text": "Fire Place",
        "value": "fireplace_1k.hdr",
        "selected": true
    },
    {
        "text": "Normal studio",
        "value": "neuer_zollhof_1k.hdr"
    },
]


const contacts = ["facebook", "telegram", "linkedin", "gmail" ]




export { environments, encodings}