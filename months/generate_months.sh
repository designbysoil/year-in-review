#!/bin/bash

# Month data: name, count, prev_month, next_month
declare -A months=(
    ["february"]="February:16:january:march"
    ["march"]="March:15:february:april"
    ["april"]="April:20:march:may"
    ["may"]="May:22:april:june"
    ["june"]="June:14:may:july"
    ["july"]="July:12:june:august"
    ["august"]="August:12:july:september"
    ["september"]="September:17:august:october"
    ["october"]="October:19:september:november"
    ["november"]="November:24:october:december"
    ["december"]="December:21:november:"
)

for month_key in "${!months[@]}"; do
    IFS=':' read -r month_name count prev next <<< "${months[$month_key]}"
    
    # Set prev nav
    if [ -z "$prev" ]; then
        prev_nav='<a href="#" class="month-nav-btn" disabled style="pointer-events: none;">← Previous</a>'
    else
        prev_nav="<a href=\"${prev}.html\" class=\"month-nav-btn\">← ${prev^}</a>"
    fi
    
    # Set next nav
    if [ -z "$next" ]; then
        next_nav='<a href="#" class="month-nav-btn" disabled style="pointer-events: none;">Next →</a>'
    else
        next_nav="<a href=\"${next}.html\" class=\"month-nav-btn\">${next^} →</a>"
    fi
    
    # Copy January as template and modify
    sed -e "s/January 2024/${month_name} 2024/g" \
        -e "s/<h1>January<\/h1>/<h1>${month_name}<\/h1>/g" \
        -e "s/18 Stories/${count} Stories/g" \
        -e "s/generatePlaceholderStories(4, 18,/generatePlaceholderStories(4, ${count},/g" \
        -e "s|<a href=\"february.html\" class=\"month-nav-btn\">February →</a>|${next_nav}|g" \
        -e "s|<a href=\"#\" class=\"month-nav-btn\" disabled style=\"pointer-events: none;\">← Previous</a>|${prev_nav}|g" \
        -e "s/const januaryStories =/const ${month_key}Stories =/g" \
        -e "s/januaryStories/${month_key}Stories/g" \
        january.html > "${month_key}.html"
    
    echo "Created ${month_key}.html"
done

echo "All month pages created!"
