import { Text } from "react-konva"

import type { TextConfig } from "konva/lib/shapes/Text"

function SingleText(props: TextConfig) {
    return (
        <Text fill="#f00" {...props} />
    )
}

export default memo(SingleText)
