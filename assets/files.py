import os
from PIL import Image

def scan_directory(directory):
    """
    Scans the provided directory and all its subdirectories for files.

    Args:
    directory (str): The directory to scan.

    Returns:
    List[str]: A list of file paths.
    """
    file_paths = []

    # Walk through the directory tree
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Construct the full file path
            file_path = os.path.join(root, file)
            file_paths.append(file_path)

    return file_paths

def is_image(file_path):
    """
    Checks if a file is an image based on its extension.

    Args:
    file_path (str): The path of the file to check.

    Returns:
    bool: True if the file is an image, False otherwise.
    """
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'}
    return os.path.splitext(file_path)[1].lower() in image_extensions

def downscale_image(file_path, max_width=1000):
    """
    Downscales an image if its width is greater than max_width.

    Args:
    file_path (str): The path of the image to downscale.
    max_width (int): The maximum width allowed.

    Returns:
    str: The path of the downscaled image if it was downscaled, otherwise None.
    """
    with Image.open(file_path) as img:
        width, height = img.size
        if width > max_width:
            # Calculate new height to maintain aspect ratio
            new_height = int((max_width / width) * height)
            new_img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save the new image
            base, ext = os.path.splitext(file_path)
            new_file_path = f"{base}_downscaled{ext}"
            new_img.save(new_file_path)
            
            return new_file_path
    return None

def main():
    # Get the current working directory
    current_directory = os.getcwd()

    # Scan the directory
    files = scan_directory(current_directory)

    # Process each file
    for file in files:
        if is_image(file):
            downscaled_file = downscale_image(file)
            if downscaled_file:
                print(f"Downscaled image saved as: {downscaled_file}")

if __name__ == "__main__":
    main()
