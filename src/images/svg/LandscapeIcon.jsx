import React from 'react'

export default function Landscape() {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        transform="rotate(-90 256 256)"
        d="M176 16 H336 A48 48 0 0 1 384 64 V448 A48 48 0 0 1 336 496 H176 A48 48 0 0 1 128 448 V64 A48 48 0 0 1 176 16 z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M16 336v-24a8 8 0 018-8h0a16 16 0 0016-16v-64a16 16 0 00-16-16h0a8 8 0 01-8-8v-24"
      />
    </svg>
  )
}
