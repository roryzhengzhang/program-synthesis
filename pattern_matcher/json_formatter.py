with open("ps_sample_dataset.json", "r") as f, open("converted_sample_dataset.json", "w") as output:
    lines = f.readlines()
    output.write("[\n")
    for index, line in enumerate(lines):
        if index < len(line)-1:
            output.write(line+",\n")
    output.write("]\n")
