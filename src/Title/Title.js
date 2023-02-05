import {  shaderMaterial, Center, Text, Float} from '@react-three/drei'
import React, { useRef, useState } from 'react'
import {  useFrame, extend } from '@react-three/fiber'
import vertexShader from './shaders/vertex.js'
import fragmentShader from './shaders/fragment.js'
import * as THREE from 'three'
import * as Tone from 'tone'


const cheby = new Tone.Chebyshev(50).toDestination();
// create a monosynth connected to our cheby
const synthA = new Tone.MonoSynth().connect(cheby);
const notesHigh = ['E5','F5','G5','A5','D5','E6','F6','G6','A6','D6']
const notesLow = ['E2','F2','G2','A2','D2','E3','F3','G3','A3','D3']

const distortion = new Tone.Distortion(0.4).toDestination();
//connect a player to the distortion
synthA.connect(distortion);

const reverb = new Tone.Reverb(4).toDestination();
synthA.connect(reverb)

const delay = new Tone.Delay(4).toDestination();
// synthA.connect(delay)

const autoWah = new Tone.AutoWah(4).toDestination();
synthA.connect(autoWah)

const bitCrusher =  new Tone.BitCrusher(4).toDestination();
synthA.connect(bitCrusher)

const freeverb = new Tone.Freeverb().toDestination();
freeverb.dampening = 1000;

synthA.connect(freeverb)


const synthB =  new Tone.AMSynth().connect(freeverb).connect(autoWah).connect(delay).connect(bitCrusher).connect(cheby).connect(distortion);


function noiseTime(){
    document.body.style.cursor = 'pointer'
    synthA.triggerAttackRelease(notesLow[Math.floor(Math.random() * notesLow.length)], 1);
}

function noiseTime2(){
    document.body.style.cursor = 'auto'
    synthB.triggerAttackRelease(notesLow[Math.floor(Math.random() * notesLow.length)], 1);
}


export default function Title(){

    const PlaneMaterial = shaderMaterial(

        {
            uTime: 0,
           
        },
        vertexShader,
        fragmentShader
    )
    extend({PlaneMaterial})

    const planeMaterial = useRef()
useFrame((state, delta) => {
    planeMaterial.current.uTime += delta
})

    return<>
    <Float>
         <Text
        
        font="Basement.otf"
        scale={6. }
        // maxWidth={1}
        position={ [ .0, 16.65, 0 ] }
        onPointerMissed={()=> Tone.start()}
        onPointerOver={()=> noiseTime()}
        onPointerOut={()=> noiseTime2()}
        
        >
          {'noise'.toUpperCase()}
          <planeMaterial ref={planeMaterial} side={THREE.DoubleSide} transparent/>

        
        </Text>
        </Float>
        </>
}