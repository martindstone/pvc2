import React from "react"
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  Menu,
  Avatar,
} from "@chakra-ui/react"
import { ColorModeButton } from "./ui/color-mode"

// Sticky top navigation bar with brand (left) and menu/actions (right)
type TopNavUser = {
  id?: string
  email?: string
  name?: string
  picture?: string
}

export const TopNav: React.FC<{ user?: TopNavUser }> = ({ user }) => {
  console.log("User in TopNav:", user);
  return (
    <Box as="header" position="sticky" top={0} zIndex={10} bg="bg" borderBottomWidth="1px" px={4} py={2}>
      <Flex align="center" justify="space-between">
        <HStack gap={3}>
          <Text fontWeight="bold" fontSize="lg" color="green.600" _dark={{ color: "green.300" }}>
            PD Value Calc
          </Text>
        </HStack>
        {user && (
          <HStack gap={2}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="ghost">
                  <Avatar.Root shape="full">
                    <Avatar.Image src={user.picture} />
                    <Avatar.Fallback name={user.name} />
                  </Avatar.Root>
                  {user?.name ?? "User"}
                </Button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content minW="40">
                  {/* <Menu.Item value="profile">Profile</Menu.Item>
                  <Menu.Item value="settings">Settings</Menu.Item>
                  <Menu.Separator /> */}
                  <Menu.Item
                    value="logout"
                    onSelect={() => {
                      window.location.href = "/auth/logout"
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            <ColorModeButton />
          </HStack>
        )}
      </Flex>
    </Box>
  )
}

export default TopNav
