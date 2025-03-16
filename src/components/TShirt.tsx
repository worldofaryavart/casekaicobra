import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface TShirtProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  dark?: boolean
}

const TShirt = ({ imgSrc, className, dark = false, ...props }: TShirtProps) => {
  return (
    <div
      className={cn(
        'relative pointer-events-none z-50 overflow-hidden',
        className
      )}
      {...props}>
      <img
        src={
          dark
            ? '/t-shirt-template-removebg-preview.png'
            : '/t-shirt-template-removebg-preview.png'
        }
        className='pointer-events-none z-50 select-none'
        alt='tshirt image'
      />

      <div className='absolute -z-10 inset-0'>
        <img
          className='object-cover min-w-full min-h-full'
          src={imgSrc}
          alt='overlaying tshirt image'
        />
      </div>
    </div>
  )
}

export default TShirt