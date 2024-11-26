/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import AudioMotionAnalyzer from 'audiomotion-analyzer';

const AudioVisualization = ({ stream, id, me }) => {
    const divRef = useRef();
    const audioRef = useRef();
    const uniqId = `audio-${id}`;

    useEffect(() => {
        if (stream) {
            audioRef.current.srcObject = stream;
            const audioContext = new AudioContext();
            const audi = document.getElementById(uniqId);
            const newAudio = new MediaStream([audi.srcObject.getAudioTracks()[0]]);
            const audioSource = audioContext.createMediaStreamSource(newAudio);

            const analyzer = new AudioMotionAnalyzer({
                source: audioSource,
                bgColor: 'rgba(0, 0, 0, 0)',
                ansiBands: false,
                showScaleX: false,
                bgAlpha: 0,
                overlay: true,
                mode: 1,
                frequencyScale: "log",
                showPeaks: false,
                channelLayout: "single",
                smoothing: 0.7,
                gradient: 'steelblue',
                volume: (me.id === id) ? 0 : 1,
                height: 300,
            });

            divRef.current.appendChild(analyzer.canvas);

            return () => {
                analyzer.destroy();
                audioContext.close();
            };
        }
    }, [id, me.id, stream, uniqId]);

    return (
        <div className="w-full h-full">
            <audio ref={audioRef} id={uniqId} autoPlay className="w-0 h-0 overflow-hidden" muted />
            <div ref={divRef} className="w-full h-full" />
        </div>
    );
};

export default AudioVisualization;