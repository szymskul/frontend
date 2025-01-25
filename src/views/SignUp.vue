<template>
    <h1>Sign Up</h1>
    <div class="register">
        <input type="text" placeholder="Enter Name" class="form-control" />
        <input type="text" placeholder="Enter Role" class="form-control" />
        <input type="password" placeholder="Enter Password" class="form-control" />
        <button class="btn btn-primary">Sign Up</button>
    </div>
</template>

<script>
    export default {
        name : "SignUp"
    }
</script>

<style>
.register {
    width: 300px;
}
</style>
