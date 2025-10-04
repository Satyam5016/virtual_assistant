import { useContext, useEffect, useRef, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'
import { CgMenuRight } from 'react-icons/cg'
import { RxCross1 } from 'react-icons/rx'

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext)
  const navigate = useNavigate()
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false)
  const [userText, setUserText] = useState('')
  const [aiText, setAiText] = useState('')
  const isSpeakingRef = useRef(false)
  const [speechAllowed, setSpeechAllowed] = useState(false)
  const synth = window.speechSynthesis

  // ✅ Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.error(error)
    }
  }

  // ✅ Speak in Hindi
  const speak = (text) => {
    if (!speechAllowed) return
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = synth.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN')
    if (hindiVoice) utterance.voice = hindiVoice
    else utterance.lang = 'hi-IN'

    isSpeakingRef.current = true

    utterance.onend = () => {
      setAiText('')
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition()
      }, 800);
    }
    synth.cancel() // Cancel any ongoing speech
    utterance.rate = 1
    utterance.pitch = 1
    synth.speak(utterance)
  }

  // ✅ Handle Gemini commands
  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)

    switch (type) {
      case 'google_search':
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, '_blank')
        break
      case 'youtube-search':
      case 'youtube-play':
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`, '_blank')
        break
      case 'calculator-open':
        window.open(`https://www.google.com/search?q=calculator`, '_blank')
        break
      case 'instagram-open':
        window.open('https://www.instagram.com/', '_blank')
        break
      case 'facebook-open':
        window.open('https://www.facebook.com/', '_blank')
        break
      case 'weather-show':
        window.open('https://www.google.com/search?q=weather', '_blank')
        break
      default:
        break
    }
  }

  // ✅ Start speech recognition
  const startRecognition = () => {
    if (!recognitionRef.current || isSpeakingRef.current) return
    try {
      recognitionRef.current.start()
    } catch (err) {
      if (err.name !== 'InvalidStateError') console.error(err)
    }
  }

  // ✅ Initialize assistant (recognition)
  const initAssistant = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return console.error('SpeechRecognition not supported')

    const recog = new SpeechRecognition()
    recog.continuous = true
    recog.lang = 'en-US'

    recog.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()
      console.log('heard:', transcript)

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText('')
        setUserText(transcript)
        recog.stop()
        try {
          const data = await getGeminiResponse(transcript)
          console.log('Gemini Response:', data)
          handleCommand(data)
          setAiText(data.response)
          setUserText('')
        } catch (err) {
          console.error('Error in getGeminiResponse:', err)
        }
      }
    }

    recog.onend = () => {
      if (!isSpeakingRef.current) setTimeout(() => startRecognition(), 500)
    }

    recog.onerror = (event) => {
      console.warn('Recognition error:', event.error)
      if (event.error !== 'aborted' && !isSpeakingRef.current) setTimeout(() => startRecognition(), 500)
    }

    recognitionRef.current = recog
  }

  // ✅ Unlock speech on first interaction
  useEffect(() => {
    const unlockSpeech = () => {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(''))
      setSpeechAllowed(true)
      window.removeEventListener('click', unlockSpeech)
      window.removeEventListener('keydown', unlockSpeech)
    }
    window.addEventListener('click', unlockSpeech)
    window.addEventListener('keydown', unlockSpeech)

    return () => {
      window.removeEventListener('click', unlockSpeech)
      window.removeEventListener('keydown', unlockSpeech)
    }
  }, [])

  // ✅ Start assistant when userData and speechAllowed are ready
  useEffect(() => {
    if (!userData?.assistantName || !speechAllowed) return
    initAssistant()
    speak("Voice enabled. I'm listening.")

    return () => recognitionRef.current?.stop()
  }, [userData, speechAllowed])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]'>

      {/* Hamburger menu (mobile only) */}
      {!ham && (
        <CgMenuRight
          className="lg:hidden text-white absolute top-5 right-5 w-6 h-6 z-50 cursor-pointer"
          onClick={() => setHam(true)}
        />
      )}



      {/* Overlay menu */}
      <div className={`absolute top-0 left-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start transition-transform duration-300 ${ham ? 'translate-x-0' : '-translate-x-full'}`}>
        <RxCross1
          className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
          onClick={() => setHam(false)}
        />
        <button
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer'
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer'
          onClick={() => navigate('/customize')}
        >
          Customize your Assistant
        </button>
        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col'>
          {userData.history?.map((his, idx) => (
            <span key={idx} className='text-gray-200 text-[18px] truncate'>
              {his}
            </span>
          ))}
        </div>
      </div>

      {/* Desktop buttons */}
      <button
        className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full text-[19px] cursor-pointer'
        onClick={handleLogOut}
      >
        Log Out
      </button>
      <button
        className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute hidden lg:block top-[100px] right-[20px] rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer'
        onClick={() => navigate('/customize')}
      >
        Customize your Assistant
      </button>

      {/* Assistant Image */}
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt='Assistant' className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {/* User / AI images */}
      {!aiText ? (
        <img src={userImg} alt="" className='w-[200px]' />
      ) : (
        <img src={aiImg} alt="" className='w-[200px]' />
      )}

      <h1 className='text-white text-[18px] font-semibold text-wrap'>
        {userText ? userText : aiText ? aiText : null}
      </h1>

    </div>
  )
}

export default Home
