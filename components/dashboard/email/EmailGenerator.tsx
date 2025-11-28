'use client'

import { useState } from 'react'
import { ViewingRoom, RoomItem } from '@/types'
import { EnvelopeSimple, Copy, Check, X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'

export function EmailGenerator({ room, heroItem }: { room: ViewingRoom, heroItem?: RoomItem }) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const roomUrl = `${window.location.origin}/view/${room.slug}`
    const imageUrl = heroItem?.artwork?.image_url || 'https://via.placeholder.com/600x400'

    // Outlook-safe HTML (Tables, inline styles)
    const emailHtml = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>${room.title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%"> 
        <tr>
            <td style="padding: 10px 0 30px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                    <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
                            <img src="${imageUrl}" alt="${room.title}" width="500" style="display: block;" />
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
                                        <b>Private Viewing Room: ${room.title}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                        We are pleased to present a new selection of works. Please click the button below to enter the private viewing room.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <a href="${roomUrl}" style="background-color: #000000; color: #ffffff; padding: 15px 25px; text-decoration: none; font-family: Arial, sans-serif; font-size: 16px; border-radius: 4px; display: inline-block;">
                                            Enter Viewing Room
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ee4c50" style="padding: 30px 30px 30px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                                        &reg; Exhibitly Gallery Suite<br/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `

    const handleCopy = () => {
        const type = "text/html";
        const blob = new Blob([emailHtml], { type });
        const data = [new ClipboardItem({ [type]: blob })];

        navigator.clipboard.write(data).then(
            () => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            },
            () => {
                alert("Clipboard write failed. Please copy manually.")
            }
        );
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <button className="w-full bg-white border border-gray-300 text-gray-700 rounded py-2 text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                    <EnvelopeSimple size={16} /> Generate Email
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[700px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50">
                    <Dialog.Title className="text-xl font-medium mb-4">Email Announcement Preview</Dialog.Title>
                    <div className="border border-gray-200 rounded p-4 h-[400px] overflow-y-auto mb-6 bg-gray-50">
                        <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleCopy}
                            className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied to Clipboard' : 'Copy HTML to Clipboard'}
                        </button>
                    </div>
                    <Dialog.Close asChild>
                        <button className="absolute top-[10px] right-[10px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none" aria-label="Close">
                            <X />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
