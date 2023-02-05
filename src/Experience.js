import {  useGLTF, Text, Float } from "@react-three/drei"
import { OrbitControls , shaderMaterial, Center} from '@react-three/drei'
import { EffectComposer } from '@react-three/postprocessing'
import { useRef , useEffect, useState, useMemo} from "react"
import { BlendFunction } from 'postprocessing'
import { Perf } from "r3f-perf"
import * as THREE from 'three'
import { useThree } from "@react-three/fiber"
import { Physics, RigidBody, Debug, CuboidCollider } from "@react-three/rapier";
import { Suspense } from "react"


import PointsComponent from "./Points/Points.js"

import Title from "./Title/Title.js"





export default function Experience(){



    return <>
      <OrbitControls makeDefault enableZoom={true}/>
      <Center>
      <Title />
        <PointsComponent />
        </Center>

    </>
}