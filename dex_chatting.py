import webbrowser
import google.generativeai as genai
from bing_image_downloader import downloader
import os
import base64

def gem(prompt):
    genai.configure(api_key="AIzaSyCk03OuBh1W_-IKvMfWD54UByiXAmYexYw")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    output = response.text
    return output

def dex_chat(prompt):
    sites = [["youtube","https://youtube.com"],["wikipedia","https://wikipedia.com"],["google","https://google.com"],["Email","https://mail.google.com/mail/u/0/#inbox"],["Instagram","https://www.instagram.com/not_aditya533/"]]

    for site in sites:
        if f"open {site[0]}".lower() in prompt.lower() or f"start {site[0]}".lower() in prompt.lower():
            output = f"Opening {site[0]} Sir..."
            webbrowser.open(site[1])
            return output
    
    if f"provide image".lower() in prompt.lower():
            search_query = prompt
            output_dir = "bing_images"
            downloader.download(search_query, limit=3, output_dir=output_dir, adult_filter_off=True, force_replace=False, timeout=60)
            image_files = os.listdir(f'./{output_dir}/{search_query}')
            image_data = []
            for image_file in image_files:
                with open(f'./{output_dir}/{search_query}/{image_file}', "rb") as img_file:
                    encoded_image = base64.b64encode(img_file.read()).decode('utf-8')
                    image_data.append(f"data:image/jpeg;base64,{encoded_image}")
            return image_data

    return gem(prompt)