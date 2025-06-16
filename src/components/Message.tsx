import { Replies } from "./Replies"

export const Message = () => {
    return <div className=''>
            <div className='flex items-center'>
                <input type="text" placeholder='message' className='p-2 m-4 border-2 border-solid rounded-md border-amber-400 text-black' />
                <button className='border-5 rounded-xl w-18 h-8 bg-yellow-700'>Send</button>
            </div>
            <div>
                <Replies/>
            </div>
    </div>
}