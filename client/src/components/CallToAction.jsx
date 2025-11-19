import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about finance?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 
        </p>
       <Button
  gradientDuoTone="cyanToBlue"
  className="rounded-tl-xl rounded-bl-none"
>
  <a
    href="https://onlinelibrary.wiley.com/journal/15406261?msockid=3123d106f7716fdb0709c255f6d76e90"
    target="_blank"
    rel="noopener noreferrer"
  >
    View financial research letters
  </a>
</Button>


      </div>
      <div className="p-7 flex-1">
        <img src="https://i.pinimg.com/736x/2f/95/2b/2f952bb1b8c132e0141fda34e1f8ca45.jpg" />
      </div>
    </div>
  );
}